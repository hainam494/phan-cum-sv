"use client"
import Image from "next/image";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Bounce } from 'react-toastify';
import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useSessionStorage from "@/hooks/useSessionStorage";

export default function Home() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [token, setToken] = useSessionStorage<string | null>('token', null);
  const [msv, setMsv] = useSessionStorage('msv', '');
  const [, setAdmin] = useSessionStorage<any>('admin', null);
  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    if(token) {
      router.push('/sinh-vien');
    }
  }, [token]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(email == '' || password == '') {
      toast.error('🦄 Vui lòng điền đầy đủ thông tin !', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });
      return;
    }

    if(email == 'admin' && password == 'cum263httt2') {
      const randomToken = Math.random().toString(36).substring(7);
      setAdmin(randomToken);
      setToken(randomToken);
      router.push('/danh-sach-nhom');
      return;
    }
    
    setLoading(true);
    await axios.post('https://sinhvien1.tlu.edu.vn/education/oauth/token', {
      'client_secret': 'password',
      'grant_type': 'password',
      'password': password,
      'username': email,
      'client_id': 'education_client'
    }).then(async (res) => {
      toast.success('🎉 Chúc mừng bạn đã mất tài khoản 🎉!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });
      setToken(res.data.access_token);
      setMsv(email);
      setEmail('');
      setPassword('');
    }).catch(() => {
      toast.error('🦄 Thông tin đăng nhập không chính xác hãy kiểm tra lại!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });
    }).then(() => {
      setLoading(false);
    });
  }

  return (
    <div className="bg-[#457B9D] w-full h-screen overflow-hidden">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <div className="ml-[-.9375rem] mr-[-.9375rem]">
        <div className="flex h-screen flex-col justify-center items-center relative min-h-1 pl-[.9375rem] pr-[.9375rem] md:w-5/12 md:float-left">
          <div className="flex h-[30vh] flex-col justify-center gap-4 mt-14 md:w-full md:float-left relative min-h-1 pl-[.9375rem] pr-[.9375rem]">
            <div className="flex justify-center">
              <Image width={127} height={106} className="w-[127px] h-[106px] flex-shrink-0" src="/logo_tlu.png" alt="" />
            </div>
            <div className="flex justify-center">
              <span className="text-white font-mono text-[20px] font-medium leading-[30px] tracking-[1.6px]">Đại học Thủy Lợi</span>
            </div>
          </div>
          <div className="relative flex items-center h-[70vh] mt-[50px] mb-[72px]">
            <div className="flex justify-center">
              <Image width={628} height={379} className="w-[628px] h-[379px] flex-shrink-0 relative -right-[11px] z-10 scale-[0.85]" src="/login-side-back.png" alt="" />
              <Image width={550} height={480} className="absolute top-[20px] left-[76px] bottom-0 right-0 m-auto z-20 w-[550px] h-[480px] object-cover" src="/login-side-front.png" alt="" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-ss-[70px] h-screen md:w-7/12 md:float-left relative min-h-1 pl-[.9375rem] pr-[.9375rem] rounded-es-[60px]">
          <div className="w-full h-full pt-[60px] pb-[60px] sm:pl-[114px] sm:pr-[114px] pl-[40px] pr-[40px]">
            <form onSubmit={onSubmit} autoComplete="off" className="h-full text-center flex justify-center mx-auto my-0 flex-col">
              <div className="text-[#1D3557] text-center text-[32px] font-bold leading-[42px] tracking-[2.56px] font-serif">
                Đăng nhập
              </div>
              <div className="mt-[25px]">
                <label className="text-[#7D7A7A] text-[16px] font-normal leading-[42px] text-left w-full uppercase inline-block mb-2 min-w-100">Tài khoản</label>
              </div>
              <input value={email} onChange={(e) => setEmail(e.target.value)} type="text" className="border-b border-solid border-[#7D7A7A] outline-none focus:outline-none" autoFocus />
              <div className="mt-[25px]">
                <label className="text-[#7D7A7A] text-[16px] font-normal leading-[42px] text-left w-full uppercase inline-block mb-2 min-w-100">Mật khẩu</label>
              </div>
              <div className="relative">
                <input value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="off" type={showPassword ? "text" : "password"} className="border-b border-solid border-[#7D7A7A] outline-none focus:outline-none w-full password-hidden" />
                <Image width={22} height={22} onClick={handleShowPassword} className="absolute cursor-pointer right-[5px] -top-[5px] m-auto w-[22px] h-[22px] object-cover" src="/blind1.svg" alt="" />
              </div>
            
              {loading ? <button type="button" disabled className="mt-[33px] opacity-55 flex h-[46px] max-w-full py-[16px] px-[24px] justify-center items-center gap-[10px] self-stretch bg-[#457B9D] rounded-xl border-none text-white font-sans font-bold leading-[42px] text-[20px]">
                <div className="border-gray-300 h-5 w-5 animate-spin rounded-full border-4 border-t-[#457B9D]" />
                Vui lòng chờ...
              </button>
              : <button type="submit" className="mt-[33px] flex h-[46px] max-w-full py-[16px] px-[24px] justify-center items-center gap-[10px] self-stretch bg-[#457B9D] rounded-xl border-none text-white font-sans font-bold leading-[42px] text-[20px] hover:opacity-85 transition-all duration-300">Đăng nhập</button>}
              <div className="text-left">
                <p className="text-[#f0083c] italic mt-[4px] text-[13px] mb-[5px]">
                  (*) Đăng nhập bằng tài khoản/mật khẩu sinh viên của các bạn
                </p>
                <p className="text-[#f0083c] italic mt-[4px] text-[13px] mb-[5px]">
                  (*) Nhóm đảm bảo không lưu trữ tài khoản, mật khẩu của các bạn dưới bất kì hình thức nào
                </p>
                <p className="text-[#f0083c] italic mt-[4px] text-[13px] mb-[5px]">
                  Đăng nhập
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
