
export default function useLogin() {
  const token = localStorage.getItem('token');
  
  return !!token;
}
