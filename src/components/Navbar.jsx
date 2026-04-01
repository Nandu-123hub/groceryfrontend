import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "../context/appContext";
import { assets } from "../assets/assets";
import toast from "react-hot-toast";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  const {
    user,
    setUser,
    setShowUserLogin,
    navigate,
    searchQuery,
    setSearchQuery,
    cartCount,
    axios,
  } = useAppContext();

  const logout = async () => {
    try {
      const { data } = await axios.get("/user/logout");
      if (data.success) {
        setUser(null);
        navigate("/");
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (searchQuery.length > 0) {
      navigate("/products");
    }
  }, [searchQuery]);

  return (
    <nav className="flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-gray-300 bg-white relative z-50">
      
      <Link to="/">
        <h2 className="text-2xl font-bold text-primary">Grocery App</h2>
      </Link>

      {/* Desktop Menu */}
      <div className="hidden sm:flex items-center gap-8">
        <Link to="/">Home</Link>
        <Link to="/products">All Products</Link>

        {/* Cart */}
        <div onClick={() => navigate("/cart")} className="relative cursor-pointer">
          <svg width="18" height="18" viewBox="0 0 14 14" fill="none">
            <path
              d="M.583.583h2.333l1.564 7.81a1.17 1.17 0 0 0 1.166.94h5.67a1.17 1.17 0 0 0 1.167-.94l.933-4.893H3.5"
              stroke="#615fff"
            />
          </svg>
          <button className="absolute -top-2 -right-3 text-xs text-white bg-indigo-500 w-[18px] h-[18px] rounded-full">
            {cartCount()}
          </button>
        </div>

        {/* User */}
        {user ? (
          <div className="relative group">
            <img src={assets.profile_icon} alt="" className="w-10" />
            <ul className="hidden group-hover:block absolute top-10 right-0 bg-white shadow border py-2 w-30 rounded-md z-50 text-sm">
              <li onClick={() => navigate("/my-orders")} className="p-2 cursor-pointer">
                My Orders
              </li>
              <li onClick={logout} className="p-2 cursor-pointer">
                Logout
              </li>
            </ul>
          </div>
        ) : (
          <>
          <button
            onClick={() => setShowUserLogin(true)}
            className="px-6 py-2 bg-indigo-500 text-white rounded-full"
          >
            Login
          </button>
          <button
            onClick={() => navigate('/seller')}
            className="px-6 py-2 bg-indigo-500 text-white rounded-full"
          >
            Seller Login
          </button>
          </>
        )}
      </div>

      {/* Mobile Icons */}
      <div className="flex items-center gap-6 md:hidden">
        <div onClick={() => navigate("/cart")} className="relative cursor-pointer">
          <svg width="18" height="18" viewBox="0 0 14 14" fill="none">
            <path d="M.583.583h2.333l1.564 7.81" stroke="#615fff" />
          </svg>
          <button className="absolute -top-2 -right-3 text-xs text-white bg-indigo-500 w-[18px] h-[18px] rounded-full">
            {cartCount()}
          </button>
        </div>

        <button onClick={() => setOpen(true)}>
          ☰
        </button>
      </div>

      {/* 🔥 Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* 🔥 Mobile Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-[70%] bg-white shadow-lg z-50 transform transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        } flex flex-col p-5 gap-4`}
      >
        <button onClick={() => setOpen(false)} className="self-end text-xl">
          ✕
        </button>

        <Link onClick={() => setOpen(false)} to="/">
          Home
        </Link>

        <Link onClick={() => setOpen(false)} to="/products">
          Products
        </Link>

        {user ? (
          <>
            <button onClick={() => navigate("/my-orders")}>
              My Orders
            </button>
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <>
          <button
            onClick={() => {
              setOpen(false);
              setShowUserLogin(true);
            }}
            className="bg-indigo-500 text-white py-2 rounded"
          >
            Login
          </button>
          <button
            onClick={() => {
              navigate('/seller')
            }}
            className="bg-indigo-500 text-white py-2 rounded"
          >
            Seller Login
          </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;