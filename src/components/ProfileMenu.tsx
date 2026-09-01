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
import { adminDropdownClass, adminToolbarButtonClass } from '@/components/admin/admin-toolbar-styles';
import { cn } from '@/lib/utils';

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

  useEffect(() => {
    if (session?.user?.email) {
      dispatch(
        fetchUserProfile({
          email: session.user.email,
        })
      );
    }
  }, [session?.user?.email, dispatch]);

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
        className={cn(adminToolbarButtonClass, 'overflow-hidden p-0')}
      >
        {status === 'succeeded' ? (
          profilePicture ? (
            <RenderProfileImage src={profilePicture} height={36} width={36} />
          ) : (
            <UserRound size={18} className="text-accent-600 dark:text-accent-400" />
          )
        ) : (
          <Skeleton circle width={36} height={36} />
        )}
      </button>

      {isOpen && (
        <div
          ref={menuRef}
          role="menu"
          className={cn(adminDropdownClass, 'w-72')}
        >
          <div className="border-b border-neutral-100 p-4 dark:border-brand-800">
            <div className="flex items-center gap-3">
              {status === 'succeeded' ? (
                profilePicture ? (
                  <RenderProfileImage
                    src={profilePicture}
                    height={48}
                    width={48}
                  />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-50 dark:bg-brand-800">
                    <UserRound size={24} className="text-accent-600 dark:text-accent-400" />
                  </div>
                )
              ) : (
                <Skeleton circle width={48} height={48} />
              )}

              <div className="min-w-0">
                <p className="truncate text-body-sm font-semibold text-brand-900 dark:text-white">
                  {profile?.user?.username || session?.user?.name || 'Admin User'}
                </p>
                <p className="mt-0.5 truncate text-caption text-neutral-500 dark:text-neutral-400">
                  {profile?.user?.email || session?.user?.email || <Skeleton width={150} />}
                </p>
              </div>
            </div>
          </div>

          <div className="p-2">
            <Link href="/user/profile" onClick={closeMenu}>
              <div className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-neutral-700 transition-colors hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-brand-800">
                <User size={18} className="text-accent-600 dark:text-accent-400" />
                <span className="text-body-sm font-medium">My Profile</span>
              </div>
            </Link>

            <button
              onClick={handleSignOut}
              className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-error-600 transition-colors hover:bg-error-50 dark:text-error-500 dark:hover:bg-error-500/10"
            >
              <LogOut size={18} />
              <span className="text-body-sm font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
