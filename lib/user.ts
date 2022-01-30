
class UserSpace {
  public modelList: Array<Function> = [];
}

class Model {
  private _userSpace: UserSpace;

  public create_time: string;
  public update_time: string;
  public delete_time: string;

  public constructor(userSpace: UserSpace) {
    this._userSpace = userSpace;
  }
}

class MemoModel extends Model {
  public content: string;
  public label: string | null;
}