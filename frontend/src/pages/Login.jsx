import LoginForm from '../components/Auth/LoginForm';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';

const Login = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <LoginForm />
      <Footer />
    </div>
  );
};

export default Login;