import Image from "next/image";

function Loading() {
    return (  
        <div className="relative flex justify-center items-center h-full min-h-[80vh] w-full">
            <div className="absolute animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-purple-500"></div>
            <Image width={112} height={112} alt="" src="/avatar-thinking-9.svg"  className="rounded-full h-28 w-28" />
        </div>
    );
}

export default Loading;