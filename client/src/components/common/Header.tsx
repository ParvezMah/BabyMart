import Container from "./Container";

const Header = () => {
  return (
    <header className="border-b sticky top-0 z-50 bg-babyshopWhite">
      <Container className="flex items-center justify-between gap-10 py-4">
        <div className="flex flex-1 items-center justify-between md:justify-start md:gap-12">
          <div className="md:hidden flex items-center gap-3">
            OrdersIcon WishlistIcon CartIcon
          </div>
        </div>
        <div className="hidden md:inline-flex items-center gap-5">
        </div>
      </Container>
    </header>
  );
};

export default Header;