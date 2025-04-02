import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// import { auth, db } from "../firebaseConfig";
import { auth, db } from "../lib/firebaseConfig";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { toast } from "@/hooks/use-toast";
import Container from "../components/ui/Container";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userDocRef = doc(db, "loginPage", "userDetails");
      const userSnap = await getDoc(userDocRef);

      if (userSnap.exists()) {
        await setDoc(userDocRef, {
          [`user_${user.uid}`]: { name, email }
        }, { merge: true });
      } else {
        await setDoc(userDocRef, {
          [`user_${user.uid}`]: { name, email }
        });
      }

      toast({
        title: "Signup successful",
        description: `Welcome, ${name}!`,
      });

      navigate("/");
    } catch (err) {
      toast({
        title: "Signup failed",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="
        signup-page
        relative
        min-h-screen
        flex
        items-center
        justify-center
        bg-uniplus-50
        py-12
        px-4
        sm:px-6
        lg:px-8
        overflow-hidden
        bubble-background
        neon-lights-anim
      "
    >
      <Container size="sm" className="animate-scale-in signup-container shadow-2xl relative z-10">
       
        <div className="flex justify-center mb-8 mt-4 neon-header-text"> 
          <Link to="/" className="flex items-center space-x-2 hover:opacity-90 transition-opacity">
            <div className="h-10 w-10 rounded-lg bg-uniplus-600 flex items-center justify-center neon-logo-shadow">
              <span className="text-white font-bold text-xl">U+</span>
            </div>
            <span className="font-bold text-2xl neon-text">UniPlus</span>
          </Link>
        </div>


        <Card className="mx-auto w-full max-w-md neon-card-shadow">
          <Card.Header>
            <Card.Title className="text-2xl text-center neon-title">Create an account</Card.Title>
            <Card.Description className="text-center neon-description">
              Sign up to get started with UniPlus
            </Card.Description>
          </Card.Header>

          <Card.Content>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1 neon-label">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="
                    w-full
                    px-3
                    py-2
                    border
                    border-border
                    rounded-md
                    shadow-sm
                    focus:outline-none
                    focus:ring-2
                    focus:ring-uniplus-500
                    focus:border-uniplus-500
                    neon-input
                  "
                  placeholder="Your name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1 neon-label">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="
                    w-full
                    px-3
                    py-2
                    border
                    border-border
                    rounded-md
                    shadow-sm
                    focus:outline-none
                    focus:ring-2
                    focus:ring-uniplus-500
                    focus:border-uniplus-500
                    neon-input
                  "
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-1 neon-label">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="
                    w-full
                    px-3
                    py-2
                    border
                    border-border
                    rounded-md
                    shadow-sm
                    focus:outline-none
                    focus:ring-2
                    focus:ring-uniplus-500
                    focus:border-uniplus-500
                    neon-input
                  "
                  placeholder="••••••••"
                />
              </div>

              <div className="pt-2">
                <Button type="submit" className="w-full neon-button" disabled={loading}>
                  {loading ? "Signing up..." : "Sign Up"}
                </Button>
              </div>
            </form>
          </Card.Content>

          <div className="text-center mt-4 pb-4 text-white">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-uniplus-600 hover:text-uniplus-500 transition-colors"
              >
                Log in
              </Link>
            </p>
          </div>
        </Card>
      </Container>

      {/* Bubbles overlay for the floating animation */}
      <div className="bubbles-overlay"></div>
    </div>
  );
};

export default Signup;
