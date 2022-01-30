import * as fs from 'fs';
import * as path from 'path';
import { getParamNameList } from './misc';
import { Metadata, CompletionInfo } from './decorator';

export module Scan {
  /**
   * A parameter of a service command or an option.
   */
  export class Param {
    /**
     * Name of the Parameter. It needs to be consistent with the corresponding formal parameter.
     */
    public name: string;

    /**
     * Introduction of the parameter.
     */
    public intro: string = '';

    /**
     * Whether this parameter is required.
     */
    public required: boolean = false;

    /**
     * List of probable types of param.
     */
    public typeList: Array<string> = [];

    /**
     * Constructor.
     * @param name
     */
    public constructor(name: string) {
      this.name = name;
    }
  }

  interface WithParam {
    /**
     * Add a param to the instance.
     * @param param
     */
    addParam(param: Param): void;

    /**
     * Get a param from the instance.
     * @param index
     */
    getParam(index: number): Param;
  }

  export class Option implements WithParam {
    /**
     * Long version of this option.
     */
    public long: string;

    /**
     * Short version of this option.
     */
    public short: string;

    /**
     * Execute function of option.
     */
    public executeFunction: Function;

    /**
     * List of parameters.
     * @private
     */
    private _paramList: Array<Param> = [];

    /**
     * Constructor.
     * @param long long version of this option.
     * @param short short version of this option.
     */
    public constructor(long: string, short: string) {
      this.long = long;
      this.short = short;
    }

    /**
     * Add a parameter to the option.
     * @param param
     */
    public addParam(param: Param) {
      this._paramList.push(param);
    }

    /**
     * Get a parameter by provided index.
     * @param index
     */
    public getParam(index: number): Param {
      return this._paramList[index];
    }
  }

  export class Service implements WithParam {
    /**
     * Name of the service.
     */
    public name: string;

    /**
     * Execute function of service class.
     */
    public executeFunction: Function;

    /**
     * List of probable types of return value.
     */
    public returnType: Array<string> = [];

    /**
     * Introduction of return value.
     */
    public returnIntro: string = '';

    /**
     * List of parameters.
     * @private
     */
    private _paramList: Array<Param> = [];

    /**
     * Map of long name of option to its reference.
     * @private
     */
    private _optionMap: Map<string, Option> = new Map();

    /**
     * Constructor.
     * @param name
     */
    public constructor(name: string) {
      this.name = name;
    }

    /**
     * Get parameter list.
     */
    public get paramList(): Array<Param> {
      return this._paramList;
    }

    /**
     * Add an option to option list.
     * @param option
     */
    public addOption(option: Option) {
      this._optionMap.set(option.long, option);
    }

    /**
     * Get an option by provided long name.
     * @param long
     */
    public getOption(long: string): Option {
      return this._optionMap.get(long);
    }

    /**
     * Add a parameter to the option.
     * @param param
     */
    public addParam(param: Param) {
      this._paramList.push(param);
    }

    /**
     * Get a parameter by provided index.
     * @param index
     */
    public getParam(index: number): Param {
      return this._paramList[index];
    }
  }

  export class Servant {
    /**
     * Name of the servant.
     */
    public name: string;

    /**
     * Map of service name to its reference.
     * @private
     */
    private _serviceMap: Map<string, Service> = new Map();

    /**
     * Constructor.
     * @param name
     */
    public constructor(name: string) {
      this.name = name;
    }

    /**
     * Register a service to this servant.
     * @param serviceName
     */
    public registerService(serviceName: string): void {
      this._serviceMap.set(serviceName, new Service(serviceName));
    }

    /**
     * Get a service.
     * @param serviceName
     */
    public getService(serviceName: string): Service {
      return this._serviceMap.get(serviceName);
    }
  }

  export class ServantManager {
    /**
     * Map of servant name to its reference.
     * @private
     */
    private _servantMap: Map<string, Servant> = new Map();

    /**
     * Register a servant by provided name if it is not found.
     * @param servantName
     */
    public registerServant(servantName: string): void {
      if (!this._servantMap.has(servantName)) {
        this._servantMap.set(servantName, new Servant(servantName));
      }
    }

    /**
     * Register a service to provided service.
     * @param servantName
     * @param serviceName
     */
    public registerService(servantName: string, serviceName: string): void {
      if (this._servantMap.has(servantName)) {
        const servant = this._servantMap.get(servantName);
        servant.registerService(serviceName);
      }
    }

    /**
     * Get a servant instance by provided name.
     * @param name
     */
    public getServant(name: string): Servant {
      return this._servantMap.get(name);
    }
  }

  class Loader {
    /**
     * Servant manager.
     * @private
     */
    private _servantManager: ServantManager = new ServantManager();

    /**
     * The name of servant that is scanning.
     * @private
     */
    private _tempServantName: string;

    /**
     * The name of service that being processed.
     * @private
     */
    private _tempServiceName: string;

    /**
     * The constructor of class of service that being processed.
     * @private
     */
    private _tempServiceConstructor: Function;

    /**
     * Get servant manager handle.
     */
    public get servantManager() {
      return this._servantManager;
    }

    /**
     * Register a service to current servant.
     * @param serviceName
     */
    public registerService(serviceName: string) {
      this._servantManager.registerService(this._tempServantName, serviceName);
      this._tempServiceName = serviceName;
    }

    /**
     * Get the temporary servant that is being processed.
     */
    public getTempServant(): Servant {
      return this._servantManager.getServant(this._tempServantName);
    }

    /**
     * Scan a directory and load apps.
     * @param dirPath
     */
    public scan(dirPath: string) {
      // get all application packages.
      const dirList: Array<string> = fs.readdirSync(dirPath)
        .map(dir => path.join(dirPath, dir))
        .filter(dir => fs.statSync(dir).isDirectory());

      // load servants
      dirList.forEach(dir => this.loadServant(dir));
    }

    /**
     * Load a servant from an application package.
     * @param dirPath absolute path of application package
     */
    public loadServant(dirPath: string) {
      const servantName: string = path.basename(dirPath);
      this._servantManager.registerServant(servantName);

      // lists .js files in service directory
      const servicePath = path.join(dirPath, 'service');
      const serviceFileList: Array<string> = fs.readdirSync(servicePath)
        .map(dir => path.join(servicePath, dir))
        .filter(file => {
          if (path.extname(file) != '.js') return false;
          return fs.statSync(file).isFile();
        });

      // require service file, the file name is regarded as servant name
      serviceFileList.forEach(file => {
        this._tempServantName = servantName;
        require(file);
        this._assemble();
      });
    }

    /**
     * temporarily save constructor of service class.
     * @param constructor
     */
    public saveServiceConstructor(constructor: Function) {
      this._tempServiceConstructor = constructor;
    }

    /**
     * Assemble.
     * @private
     */
    private _assemble() {
      const constructor = this._tempServiceConstructor;
      const serviceName = this._tempServiceName;
      const service = this.getTempServant().getService(serviceName);

      // execute function - @Execute()
      const executeFunction = service.executeFunction = Metadata.get('ExecuteFunction', constructor);

      // introduction and type list of return value
      service.returnIntro = Metadata.get('returnIntro', constructor, executeFunction.name);
      const returnType = Metadata.get('returnType', constructor, executeFunction.name);
      service.returnType = Array.isArray(returnType) ? returnType : [returnType];

      // params of execute function - @Param()
      this._assembleParams(service, executeFunction, constructor);

      // completion of service
      const completion: CompletionInfo = Metadata.get('completion', constructor, executeFunction.name);

      // options of service - @Option()
      const optionList: Array<Option> = Metadata.get('optionList', constructor);
      if (optionList) {
        for (const option of optionList) {
          // params of option - @Param()
          this._assembleParams(option, option.executeFunction, constructor);

          // completion of option
          const completion = Metadata.get('completion', constructor, option.executeFunction.name);

          // add option to service
          service.addOption(option);
        }
      }
    }

    /**
     * Assemble the parameters of services or options.
     * @param handle
     * @param executeFunction
     * @param constructor
     * @private
     */
    private _assembleParams(handle: WithParam, executeFunction: Function, constructor: Function) {
      const executeFunctionName = executeFunction.name;
      const paramList: Array<Param> = Metadata.get('paramList', constructor, executeFunctionName);
      if (!paramList) return;

      const paramNameList = getParamNameList(executeFunction);
      const requiredParamIndexList: Array<number> = Metadata.get('requiredParamIndexList', constructor, executeFunctionName);
      for (let i = 0; i < paramNameList.length; ++i) {
        const name: string = paramNameList[i];
        const param: Param = paramList.find(param => param.name == name);
        param.required = i in requiredParamIndexList;
        handle.addParam(param);
      }
    }
  }

  /**
   * Singleton of Loader.
   */
  export const loader = new Loader();
}