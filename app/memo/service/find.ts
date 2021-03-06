import { Str, List } from '../../../lib/type';
import {
  Option,
  Required,
  Completion,
  Execute,
  Param,
  Service,
  Return
} from '../../../lib/decorator';
import { Tracer } from '../../../lib/tracer';

@Service('find')
class Find extends Tracer.Service {
  @Execute()
  @Return('List<Obj<K, V>>', 'Find memos.')
  @Param('keys', ['Str', 'List<Str>'], 'Key words of memo.')
  public main(@Required keys: Str | List<Str>) {}

  @Completion('keys')
  public $keys() {}

  @Option('update', 'u')
  public update(): void {}

  @Option('remove', 'r')
  public remove(): void {}
}
