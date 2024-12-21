const Header = () => {
  return (
    <div className="flex items-center gap-4">
      <a href="/">
        <img src="/chevron.png" alt="" className="w-6 h-4" />
      </a>
      <h1 className="text-[var(--primary)] text-xl font-bold">
        Complete the puzzle!
      </h1>
    </div>
  );
};

export default Header;
