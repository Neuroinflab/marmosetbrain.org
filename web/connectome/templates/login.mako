<%inherit file='base.mako' />
<%block name='scripts'>
</%block>
<div class="banner">
    <div class="banner-title">
        <div class="emc-logo"></div>
        <div class="emc-banner"></div>
    </div>
</div>
<div class="content">
    <p></p>
    <form action="/login" method="post" id="form-login">
        <div class="login-wrap">
            <table cellpadding="0" cellspacing="0" border="0" class="form-table center login-form-table">
                <tr>
                    <td colspan="2" class="header1"><h1>Marmoset Portal Login</h1></td>
                </tr>
                <tr>
                    <td>Username</td>
                    <td>
                        <input type="text" name="username" value="${username}">
                    </td>
                </tr>
                <tr>
                    <td>Password</td>
                    <td>
                        <input type="password" name="password" value="">
                    </td>
                </tr>
                <tr>
                    ##<td colspan="2" class="TAC"><a class="button-submit" href="javascript:void(0)" id="button-registration-submit">Submit</a></td>
                    <td colspan="2" class="center">
                        <input type="hidden" name="came_from" value="${came_from}"/>
                        <button>Login</button>
                    </td>
                </tr>
            </table>
        </div>
    </form>
</div>
