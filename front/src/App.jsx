import { useEffect, useState } from "react";
import { Grid, Button } from "@mui/material";
import LogIn from "./components/LogIn";
import SignIn from "./components/SingIn";
import {
  getAuth,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
} from "firebase/auth";
import { app } from "./service/firebaseConfig";
import { Toaster, toast } from "sonner";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      toast.success("Bienvenido");
    }
  }, [user]);

  const provider = new GoogleAuthProvider();

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(getAuth(app), provider);
    } catch (error) {
      console.error(error);
    }
  };

  if (user) {
    return (
      <div>
        <Toaster />
        <h1>Bienvenido {user.displayName}</h1>
        {user.photoURL && <img src={user.photoURL} alt={user.displayName} />}
        <button
          onClick={() => {
            signOut(getAuth(app));
          }}
        >
          Cerrar Sesión
        </button>
      </div>
    );
  } else {
    return (
      <>
        <Toaster />
        <Grid container direction="column" alignItems="center" spacing={2}>
          <Grid item>{isLoggedIn ? <LogIn /> : <SignIn />}</Grid>
          <Grid item>
            {!isLoggedIn ? (
              <>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => setIsLoggedIn(true)}
                >
                  Mostrar Crear Cuenta
                </Button>
                <Button
                  fullWidth
                  sx={{ mt: 1 }}
                  variant="contained"
                  onClick={handleGoogleSignIn}
                >
                  Iniciar Sesión con Google
                </Button>
              </>
            ) : (
              <Button
                fullWidth
                variant="contained"
                onClick={() => setIsLoggedIn(false)}
              >
                Mostrar Iniciar Sesión
              </Button>
            )}
          </Grid>
        </Grid>
      </>
    );
  }
}

export default App;
