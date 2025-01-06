const Footer = () => {
  return (
    <footer className="bg-stone-100 text-blue-950  shadow-xl" dir="ltr">
      <div className="max-w-screen-xl mx-auto px-4 flex flex-col items-center md:flex-row justify-between py-6">
        {/* Left side: Brand name */}
        <div className="text-center md:text-left mb-6 md:mb-0">
          <h2 className="text-2xl font-semibold ">DWash</h2>
        </div>

        {/* Right side: Copyright */}
        <div className="text-center md:text-right">
          <p className="text-sm ">
            © {new Date().getFullYear()} DWash. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
