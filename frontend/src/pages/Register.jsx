import RegisterForm from '../components/Auth/RegisterForm';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';

const Register = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <RegisterForm />
      <Footer />
    </div>
  );
};

export default Register;