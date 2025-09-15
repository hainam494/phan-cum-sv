"use client"

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Star, Trophy, PartyPopper } from 'lucide-react';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import axios from "axios";

function Page() {
    interface Confetti {
        id: number;
        color: string;
        size: number;
        left: number;
        animationDuration: number;
        delay: number;
    }
    
    const [confetti, setConfetti] = useState<Confetti[]>([]);
    const [mounted, setMounted] = useState(false);
    const [name, setName] = useState<string>('');
    const router = useRouter();
    const MySwal = withReactContent(Swal);
    const [message, setMessage] = useState<string>('Tạm thời chưa có kết quả của bạn.');
    const [membersName, setMembersName] = useState<string>('');

    useEffect(() => {
        const msv = sessionStorage.getItem('msv');
        if(!msv){
            router.push('/');
        }else{
            const name = sessionStorage.getItem('name');
            if(!name){
                router.push('/');
            }else{
                setName(name);
            }

            const getResult = async () => {
                await axios.get('/api/get-result?studentId=' + msv).then((res) => {
                    setMessage(res.data.message);
                    setMembersName(res.data.membersName);
                });
            }

            getResult();
        }
        setMounted(true);
        const colors = ['#FFD700', '#FF69B4', '#00CED1', '#FF6347', '#98FB98'];
        const newConfetti = Array.from({ length: 50 }).map((_, index) => ({
            id: index,
            color: colors[Math.floor(Math.random() * colors.length)],
            size: Math.random() * 10 + 5,
            left: Math.random() * 100,
            animationDuration: Math.random() * 3 + 2,
            delay: Math.random() * 2
        }));
        setConfetti(newConfetti);
    }, [router])
    
    if (!mounted) {
        return null;
    }

    const handleShowMember = async () => {
        MySwal.fire(
            'Thành viên trong ' + message + ':',
            membersName,
            'info'
        )
    }
    return (  
        <div className="min-h-screen bg-gradient-to-b from-purple-600 to-blue-600 flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
            {Array.from({ length: 20 }).map((_, index) => (
            <div
                key={`bubble-${index}`}
                className="absolute rounded-full bg-white/10 backdrop-blur-sm"
                style={{
                width: `${Math.random() * 100 + 50}px`,
                height: `${Math.random() * 100 + 50}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${Math.random() * 5 + 3}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 2}s`
                }}
            />
            ))}

            {confetti.map((conf) => (
            <div
                key={`confetti-${conf.id}`}
                className="absolute"
                style={{
                width: `${conf.size}px`,
                height: `${conf.size}px`,
                backgroundColor: conf.color,
                left: `${conf.left}%`,
                top: '-20px',
                animation: `confetti ${conf.animationDuration}s linear infinite`,
                animationDelay: `${conf.delay}s`,
                transform: `rotate(${Math.random() * 360}deg)`
                }}
            />
            ))}

            <div 
            className="absolute inset-0" 
            style={{
                background: 'radial-gradient(circle at center, rgba(255, 215, 0, 0.2), transparent)',
                animation: 'spin 20s linear infinite',
                transformOrigin: 'center'
            }}
            />
        </div>

        <div className="max-w-2xl w-full bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-8 text-center relative z-10">
            <div className="absolute top-0 left-0 w-full h-full">
                <div className="absolute top-4 left-4">
                    <Star className="w-6 h-6 text-yellow-400 animate-pulse" />
                </div>
                <div className="absolute top-4 right-4">
                    <Star className="w-6 h-6 text-yellow-400 animate-pulse" />
                </div>
                <div className="absolute bottom-4 left-4">
                    <Star className="w-6 h-6 text-yellow-400 animate-pulse" />
                </div>
                <div className="absolute bottom-4 right-4">
                    <Star className="w-6 h-6 text-yellow-400 animate-pulse" />
                </div>
            </div>
            <div className="mb-6">
                <div className="inline-block bg-yellow-100 p-4 rounded-full animate-bounce">
                    <Trophy className="w-16 h-16 text-yellow-500" />
                </div>
            </div>

            <h1 className="text-4xl font-bold text-gray-800 mb-4">
            🎉🎉 Chúc mừng 🎉🎉 <br /> {name}
            </h1>
            
            <p className="text-xl text-gray-600 mb-6">
            Bạn đã được cụm 2 63HTTT2 chọn là người chiến thắng cuộc thi &quot;Ai là người mất acc đầu tiên&quot;
            </p>
            
            <div className="bg-white/80 backdrop-blur p-6 rounded-xl mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                    Nhóm của bạn nhận được là:
                </h2>
                <p className="text-3xl font-bold text-purple-600">
                    {message}
                </p>
            </div>

            <button onClick={handleShowMember} className="bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105">
            Xem thành viên trong nhóm
            </button>

            <div className="mt-8 flex justify-center gap-4">
                <div className="flex items-center gap-2 bg-white/80 backdrop-blur px-4 py-2 rounded-full">
                    <PartyPopper className="w-5 h-5 text-yellow-500" />
                    <span className="text-yellow-700 font-medium">Người chiến thắng</span>
                </div>
            </div>
        </div>

        <style>
            {`
            @keyframes float {
                0%, 100% { transform: translateY(0) rotate(0deg); }
                50% { transform: translateY(-20px) rotate(10deg); }
            }
            
            @keyframes confetti {
                0% { 
                transform: translateY(-20px) rotate(0deg);
                opacity: 1;
                }
                100% { 
                transform: translateY(100vh) rotate(720deg);
                opacity: 0;
                }
            }

            @keyframes spin {
                from {
                transform: rotate(0deg);
                }
                to {
                transform: rotate(360deg);
                }
            }
            `}
        </style>
    </div>
    );
}

export default Page;