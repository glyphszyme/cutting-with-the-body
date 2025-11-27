import Link from 'next/link';

interface FrameLinkProps {
    href?: string;
    onClick?: () => void;
    type?: 'button' | 'submit';
    children: React.ReactNode;
}

export default function FrameLink({ href, onClick, type = 'button', children }: FrameLinkProps) {
    // href가 있으면 Link로 렌더링 (페이지 이동)
    if (href) {
        return (
            <Link href={href} className="frame-link">
                {children}
            </Link>
        );
    }
    
    // onClick 또는 type이 있으면 button으로 렌더링 (이벤트 핸들러 또는 form submit)
    return (
        <button 
            type={type}
            onClick={onClick}
            className="frame-link frame-link--button"
        >
            {children}
        </button>
    );
}
