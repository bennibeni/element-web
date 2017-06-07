/*
Copyright 2017 Vector Creations Ltd

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import React from 'react';
import sdk from 'matrix-react-sdk';
import { _t } from 'matrix-react-sdk/lib/languageHandler';


/**
 * Prompt the user to set a password
 *
 * On success, `onFinished()` when finished
 */
export default React.createClass({
    displayName: 'SetPasswordDialog',
    propTypes: {
        onFinished: React.PropTypes.func.isRequired,
    },

    getInitialState: function() {
        return {
            error: null,
            success: false,
        };
    },

    _onPasswordChanged: function() {
        this.setState({
            success: true,
        });
    },

    _onContinueClicked: function() {
        this.props.onFinished(true);
    },

    _onPasswordChangeError: function(err) {
        let errMsg = err.error || "";
        if (err.httpStatus === 403) {
            errMsg = _t('Failed to change password. Is your password correct?');
        } else if (err.httpStatus) {
            errMsg += _t(
                ' (HTTP status %(httpStatus))',
                { httpStatus: err.httpStatus },
            );
        }
        this.setState({
            error: errMsg,
        });
    },

    render: function() {
        const BaseDialog = sdk.getComponent('views.dialogs.BaseDialog');
        const ChangePassword = sdk.getComponent('views.settings.ChangePassword');

        if (this.state.success) {
            return (
                <BaseDialog className="mx_SetPasswordDialog"
                    onFinished={this.props.onFinished}
                    title={ _t('You have successfully set a password!') }
                >
                    <div className="mx_Dialog_content">
                        <p>
                            { _t('You can now return to your account after signing out, and sign in on other devices.') }
                        </p>
                    </div>
                    <div className="mx_Dialog_buttons">
                        <button
                            className="mx_Dialog_primary"
                            autoFocus={true}
                            onClick={this._onContinueClicked}>
                                { _t('Continue') }
                        </button>
                    </div>
                </BaseDialog>
            );
        }

        return (
            <BaseDialog className="mx_SetPasswordDialog"
                onFinished={this.props.onFinished}
                title={ _t('Please set a password!') }
            >
                <div className="mx_Dialog_content">
                    <p>
                        { _t('This will allow you to return to your account after signing out, and sign in on other devices.') }
                    </p>
                    <ChangePassword
                        className="mx_SetPasswordDialog_change_password"
                        rowClassName=""
                        rowLabelClassName=""
                        rowInputClassName=""
                        buttonClassName="mx_Dialog_primary mx_SetPasswordDialog_change_password_button"
                        confirm={false}
                        autoFocusNewPasswordInput={true}
                        onError={this._onPasswordChangeError}
                        onFinished={this._onPasswordChanged} />
                    <div className="error">
                        { this.state.error }
                    </div>
                </div>
            </BaseDialog>
        );
    },
});