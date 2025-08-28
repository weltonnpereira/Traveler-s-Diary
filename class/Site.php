<?php

    class Site {
        public static function logged() {
            return isset($_SESSION['logged']) ? true : false;
        }

        public static function loggout() {
            session_destroy();
            header('Location: '.INCLUDE_PATH);
        }

        public static function alert($type, $msg) {
			if ($type == 'success') {
                echo '<script>
                    var opacity = 0;
                    var intervalID = 0;

                    function fadeOut() {
                        intervalID=setInterval(hide,20);
                    }

                    const success = document.querySelector(".success-box")
                    alertSuccess(success, "'.$msg.'")

                    function alertSuccess(div, msg) {
                        div.textContent = msg
                        div.style.display = "block"
                        setTimeout(()=>{fadeOut()}, 2000)
                    }

                    function hide () {
                        opacity = Number(window.getComputedStyle(success).getPropertyValue("opacity"));

                        if (opacity > 0) {
                            opacity=opacity-0.1;
                            success.style.opacity=opacity;
                        } else {
                            clearInterval(intervalID);
                        }
                    }
                </script>';
			} else if ($type == 'error') {
                /*echo '<script>document.querySelector(".error-box").style.display = "block";</script>';*/
                echo '<script>
                    var opacity = 0;
                    var intervalID = 0;

                    function fadeOut() {
                        intervalID=setInterval(hide,20);
                    }

                    const error = document.querySelector(".error-box")
                    alertError(error, "'.$msg.'")

                    function alertError(div, msg) {
                        div.textContent = msg
                        div.style.display = "block"
                        setTimeout(()=>{fadeOut()}, 2000)
                    }

                    
                    function hide () {
                        opacity = Number(window.getComputedStyle(error).getPropertyValue("opacity"));

                        if (opacity > 0) {
                            opacity=opacity-0.1;
                            error.style.opacity=opacity;
                        } else {
                            clearInterval(intervalID);
                        }
                    }
                </script>';
			}
		}
    }

?>