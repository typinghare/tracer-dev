type UserInfo = {
  id: string
}

export module Tracer {
  export class Service {
    /**
     * User info.
     * @private
     */
    private _userInfo: UserInfo;

    /**
     * Get user id of current user.
     * @protected
     */
    protected getUserId(): string {
      return this._userInfo.id;
    }
  }
}