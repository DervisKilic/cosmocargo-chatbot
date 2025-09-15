import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCurrentUser, loginUser, logoutUser, type LoginRequest } from '@/services/user-service';
import { useRouter } from 'next/navigation';
import { UserRole } from '@/model/types';
export const useAuth = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  // Hämta nuvarande användare
  const { 
    data: user, 
    isLoading, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['currentUser'],
    queryFn: getCurrentUser,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minuter
    refetchOnWindowFocus: false,
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      // Spara token (om du använder localStorage/cookies)
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth-token', data.token);
      }
      
      // Uppdatera user cache
      queryClient.setQueryData(['currentUser'], data.user);
      
      // Redirect till dashboard
      router.push('/dashboard');
    },
    onError: (error) => {
      console.error('Login error:', error);
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      // Rensa token
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth-token');
      }
      
      // Rensa all cached data
      queryClient.clear();
      
      // Redirect till login
      router.push('/login');
    },
  });

  // Login funktion
  const login = (credentials: LoginRequest) => {
    return loginMutation.mutateAsync(credentials);
  };

  // Logout funktion
  const logout = () => {
    logoutMutation.mutate();
  };

  // Kontrollera om användaren är autentiserad
  const isAuthenticated = !!user && !error;

  return {
    user,
    isLoading: isLoading || loginMutation.isPending,
    error: error || loginMutation.error,
    isAuthenticated,
    login,
    logout,
    refetch,
    loginMutation,
    logoutMutation,
  };
};

// Utility för att växla mellan roller under utveckling
export const switchMockRole = (role: UserRole) => {
  localStorage.setItem("mockUserRole", role);
  window.location.reload();
}; 