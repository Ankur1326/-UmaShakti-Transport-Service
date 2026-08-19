'use client';

import { useEffect, useRef, useState, useCallback, memo } from 'react';
import { useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { fetchUserProfile } from '@/redux/slices/userSlice';
import Skeleton from 'react-loading-skeleton';
import { UserRound, LogOut, User } from 'lucide-react';

const RenderProfileImage = memo(
  ({ src, width, height }: { src?: string; width: number; height: number }) => (
    <div className="overflow-hidden rounded-full">
      <Image
        src={src || '/avatar-placeholder.png'}
        alt="Profile image"
        width={width}
        height={height}
        className="object-cover"
      />
    </div>
  )
);

RenderProfileImage.displayName = 'RenderProfileImage';

export default function ProfileMenu() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);

  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();

  const { profile, profilePicture, status } = useSelector(
    (state: RootState) => state.user
  );

  /* 🔹 Fetch profile only when required data exists */
  useEffect(() => {
    if (session?.user?.email) {
      dispatch(
        fetchUserProfile({
          email: session.user.email,
        })
      );
    }
  }, [session?.user?.email]);

  const toggleMenu = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const closeMenu = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleSignOut = useCallback(async () => {
    await signOut({ redirect: false });
    router.push('/sign-in');
  }, [router]);

  /* 🔹 Close on outside click + ESC key */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        closeMenu();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeMenu();
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [closeMenu]);

  return (
    <div className="relative">
      <button
        onClick={toggleMenu}
        aria-expanded={isOpen}
        aria-label="Open profile menu"
        className="flex items-center justify-center h-9 w-9 rounded-full border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        {status === 'succeeded' ? (
          profilePicture ? (
            <RenderProfileImage src={profilePicture} height={36} width={36} />
          ) : (
            <UserRound size={18} className="text-[#66B788]" />
          )
        ) : (
          <Skeleton circle width={36} height={36} />
        )}
      </button>

      {isOpen && (
        <div
          ref={menuRef}
          role="menu"
          className="absolute right-0 mt-2 w-72 z-20 bg-white dark:bg-gray-800 shadow-lg rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden"
        >
          <div className="p-4 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3">
              {status === 'succeeded' ? (
                profilePicture ? (
                  <RenderProfileImage
                    src={profilePicture}
                    height={48}
                    width={48}
                  />
                ) : (
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-[#f0f9f4] dark:bg-gray-700">
                    <UserRound size={24} className="text-[#66B788]" />
                  </div>
                )
              ) : (
                <Skeleton circle width={48} height={48} />
              )}

              <div>
                {/* <p className="font-semibold text-gray-800 dark:text-white text-sm">
                  {profile?.user?.username || <Skeleton width={100} />}
                </p> */}
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {profile?.user?.email || <Skeleton width={150} />}
                </p>
              </div>
            </div>
          </div>

          <div className="p-2">
            {/* <Link href="/user/profile" onClick={closeMenu}>
              <div className="flex items-center gap-3 px-3 py-2.5 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                <User size={18} className="text-[#66B788]" />
                <span className="text-sm font-medium">My Profile</span>
              </div>
            </Link> */}

            <button
              onClick={handleSignOut}
              className="w-full mt-1 flex items-center gap-3 px-3 py-2.5 rounded-md text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <LogOut size={18} />
              <span className="text-sm font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
