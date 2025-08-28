<?php ob_start(); ?>
<?php include('config.php'); ?>
<!DOCTYPE html>
<html>
<head>
	<meta http-equiv="X-UA-Compatible" content="IE=Edge">
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
	<title>Traveler's Diary</title>
	<link rel="stylesheet" href="<?php echo INCLUDE_PATH ?>css/style.css" />
	<!--<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">-->
	<link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.1.0/css/font-awesome.min.css" rel="stylesheet">
	<link href="https://fonts.googleapis.com/css2?family=Caveat&display=swap" rel="stylesheet">
	<link rel="icon" href="<?php echo INCLUDE_PATH ?>outer.ico" type="image/x-icon" />
</head>
<body>
<div id="success" class="success-box"></div>
<div id="error" class="error-box"></div>
	<?php if (strpos($_SERVER['REQUEST_URI'], 'to_note') !== false) { ?>
		<div id="side-menu" class="side-menu">
			<div class="menu">
				<h2>Menu</h2>
				<?php echo $_SERVER['SERVER_ADDR']; ?>
			</div>
			<ul>
				<li id="opcl-search"><i class="fa fa-search" aria-hidden="true"></i></li>
				<li id="opcl-source"><i class="fa fa-link" aria-hidden="true"></i></li>
				<li id="book-type"><i class="fa fa-book" aria-hidden="true"></i></li>
				<li id="mark-key"><i class="fa fa-bookmark" aria-hidden="true"></i></li>
				<li id="del-el"><i class="fa fa-trash-o" aria-hidden="true"></i></li>
			</ul>
			<div class="close-menu">
				<a href="<?php echo INCLUDE_PATH ?>"><i class="fa fa-arrow-left" aria-hidden="true"></i></a>
			</div>
		</div>
	<?php } ?>
	<div class="diary">
		<div class="box-search">
			<button class="change-button" id="change-type-search"><i class="fa fa-bookmark" aria-hidden="true"></i></button>
			<input type="text" id="search-input-number" placeholder="Browse page number" />
			<button class="search-button" id="search-button-page-number"><i class="fa fa-search"></i></button>
		</div>
		<div class="box-links">
			<div class="title">
				<h2>Pages: ?</h2><br />
			</div>
			<div class="links-container"></div>
			<div class="plus-link">
				<i id="add-source" class="fa fa-plus" aria-hidden="true"></i>
				<h2>Sources: 0</h2>
			</div>
		</div>
		<div class="box-book-type">
			<select id="book-type-select">
				<option value="default" selected>Default</option>
				<option value="info-technology">Informática</option>
				<option value="sales-and-negotiations">Vendas e Negociações</option>
				<option value="portuguese">Português</option>
				<option value="banking-knowledge">Conhecimentos Bancários</option>
				<option value="mathematics">Matemática</option>
				<option value="financial-mathematics">Matemática Financeira</option>
				<option value="current-trends-in-the-financial-market">Atualidades do Mercado Financeiro</option>
				<option value="english">Inglês</option>
			</select>
		</div>
		<div class="cover">
			<img src="logo.png" alt="" />
			<h2>Outer Wilds Ventures</h2>
			<h2>Traveler's Diary</h2>
		</div>
			<?php
				$url = isset($_GET['url']) ? $_GET['url'] : 'sumary';
				if (file_exists('pages/'.$url.'.php')) {
					include('pages/'.$url.'.php');
				} else {
					include('pages/sumary.php');
				}
			?>
		<div class="back-cover"></div>
	</div>
<script src="<?php echo INCLUDE_PATH; ?>js/jquery.js"></script>
<script src="<?php echo INCLUDE_PATH; ?>js/general-scripts.js"></script>
<script src="<?php echo INCLUDE_PATH; ?>js/jquery-scripts.js"></script>
<script src="<?php echo INCLUDE_PATH; ?>lib/fabric.min.js"></script>
<?php if (strpos($_SERVER['REQUEST_URI'], 'to_note') !== false) { ?>
	<script src="<?php echo INCLUDE_PATH; ?>js/to-note.js"></script>
<?php } ?>
<script>
	function togglePasswordVisibility() {
		var pwdInput = document.getElementById("user_pwd");
		var pwdIcon = document.querySelector(".toggle-pwd i");

		if (pwdInput.type === "password") {
			pwdInput.type = "text";
			pwdIcon.classList.remove("fa-eye");
			pwdIcon.classList.add("fa-eye-slash");
		} else {
			pwdInput.type = "password";
			pwdIcon.classList.remove("fa-eye-slash");
			pwdIcon.classList.add("fa-eye");
		}
	}
</script>
<script>
	document.addEventListener('DOMContentLoaded', function () {
		const urlParams = new URLSearchParams(window.location.search);
		const bookParam = urlParams.get('book');
		
		const selectElement = document.getElementById('book-type-select');
		
		if (bookParam) {
			selectElement.value = bookParam;
		}
		
		selectElement.addEventListener('change', function () {
			const selectedBook = this.value;
			const currentURL = new URL(window.location.href);
			currentURL.searchParams.set('book', selectedBook);
			window.location.href = currentURL.toString();
		});
	});
</script>
</body>
</html>
<?php ob_end_flush(); ?>