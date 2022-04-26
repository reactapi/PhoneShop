export const Footer = () => {
	const nowYear = new Date().getFullYear();

	return (
		<footer className="sticky-footer bg-white">
			<div className="container my-auto">
				<div className="copyright text-center my-auto fw-bold">
					<span>
						&copy; {nowYear}, Designed by
						<i className="fa fa-heart heart"></i>
						Hùng ITM
					</span>
				</div>
			</div>
		</footer>
	);
};
