import { Execute, Return, Service, Param, Required } from '../../../lib/decorator';
import { Str } from '../../../lib/type';

@Service('mark')
class Mark {
  @Execute()
  @Return('Null', 'Mark a memo.')
  @Param('content', 'Str', 'The content of memo.')
  @Param('label', 'Str', 'The label of memo.')
  public main(@Required content: Str, label: Str) {
  }
}