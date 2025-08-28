<?php
    if (isset($_GET['loggout'])) {
        Site::loggout();
    }
?>
<div class="sumary-page">
    <?php
        if (Site::logged() == false) {
            if (isset($_POST['enter_account'])) {
                $user = $_POST['user'];
                $pwd = $_POST['pwd'];
    
                if ($user == '') {
                    Site::alert('error', "✖ The field user cannot be empty. ✖");
                } else if ($pwd == '') {
                    Site::alert('error', "✖ The field password cannot be empty. ✖");
                } else {
                    $sql = MySql::connect()->prepare("SELECT * FROM `".DIARY_TABLE."` WHERE user = ? AND pwd = ?");
                    $sql->execute(array($user, $pwd));
                    if ($sql->rowCount() == 1) {
                        $info = $sql->fetch();
                        $_SESSION['logged'] = true;
                        $_SESSION['user'] = $user;
					    $_SESSION['password'] = $password;
                        header('Location: '.INCLUDE_PATH);
                        die();
                    } else {
                        Site::alert('error', "✖ User or pwd incorrects. ✖");
                    }
                }
            }
    ?>

    <div class="login-box">
    <h2>Enter</h2>
        <form method="post">
            <div class="notebook-line">
                <input type="text" name="user" placeholder="User...">
            </div>
            <div class="notebook-line pwd-field">
                <input type="password" id="user_pwd" name="pwd" placeholder="Password...">
                <span class="toggle-pwd" onclick="togglePasswordVisibility()"><i class="fa fa-eye"></i></span>
            </div>
            <input type="submit" name="enter_account" value="Login!">
        </form>
    </div>
    <?php } else { ?>
        <h2>Adventurer Guide</h2>
        <img src="logo.png" alt="" />
        <a href="<?php echo INCLUDE_PATH ?>to_note">To note..................................................<i class="fa fa-arrow-left" aria-hidden="true"></i></a>
        <a href="<?php echo INCLUDE_PATH ?>credits">Credits..................................................<i class="fa fa-arrow-left" aria-hidden="true"></i></a>
        <a href="<?php echo INCLUDE_PATH ?>?loggout">Exit..................................................<i class="fa fa-arrow-left" aria-hidden="true"></i></a>
    <?php } ?>
</div>