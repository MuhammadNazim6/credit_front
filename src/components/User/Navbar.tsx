import React, { useRef, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useGoogleLogin } from '@react-oauth/google';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import Api from '@/services/api'
import { useDispatch, useSelector } from 'react-redux'
import { logout, setAdminCredentials, setCredentials } from '@/redux/slices/authSlice'
import { RootState } from '@/redux/store'
import axios from 'axios';
import { useToast } from "@/components/ui/use-toast"
import { FaEyeSlash, FaEye } from "react-icons/fa";
import { Spinner } from '@/components/ui/spinner';





const FormSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
})


function Navbar() {
  const { userLoggedIn, adminLoggedIn, userInfo, adminInfo } = useSelector((state: RootState) => state.auth)

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const loginModalClose = useRef()
  const { toast } = useToast()
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false)


  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: ""
    },
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsLoggingIn(true)
    const response = await Api.post('/user/login', data)
    if (response.data.success) {
      if (loginModalClose.current) loginModalClose.current.click()
      if (response.data.isAdmin) {
        dispatch(setAdminCredentials({ ...response.data.data }));
        navigate("/", { replace: true });
        return
      }

      dispatch(setCredentials({ ...response.data.data }));
      navigate("/", { replace: true });
    } else {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: response.data.message,
      })
    }
    setIsLoggingIn(false)
  }

  const handleLogout = async () => {
    dispatch(logout())
    navigate("/", { replace: true });
  }

  const GoogleSignup = useGoogleLogin({
    onSuccess: async (response) => {
      setIsLoggingIn(true)
      try {
        const res = await axios.get(
          `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${response.access_token}`
        );
        const googleUserData = {
          name: res.data.name,
          email: res.data.email,
          password: res.data.sub,
          isGoogle: true
        }
        const signed = await Api.post('/user/google-signin', googleUserData)
        if (signed.data.success) {
          if (loginModalClose.current) loginModalClose.current.click()
          dispatch(setCredentials({ ...signed.data.data }))
          navigate("/", { replace: true });
        } else {
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: signed.data.message,
          })
        }
        setIsLoggingIn(false)
      } catch (error) {
        console.error(error);
        setIsLoggingIn(false)
      }
    },
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="w-full flex justify-between p-5 border-b-2 select-none">
      <div className="flex items-center w-1/3">
        <div className="relative w-10 h-10">
          {/* <img src={logo} alt="Logo 1" className="absolute top-0 left-0 w-1h-10 h-10" />
      <img src={logoWhite} alt="Logo 2" className="absolute top-0 left-0 w-1h-10 h-10 opacity-75" /> */}
        </div>
        <NavLink to="/" className="p-2">Credit App</NavLink>
      </div>

      {userLoggedIn &&
        <div className="flex justify-center items-center space-x-8 w-1/3">
          <p>Home</p>
          <p>Payments</p>
          <p>Budget</p>
          <p>Card</p>
        </div>}

      <div className="flex items-center justify-end space-x-5 w-1/3">
        {userLoggedIn || adminLoggedIn
          ? (<>
            <p>{userLoggedIn && userInfo.name}</p>
            <p>{adminLoggedIn && adminInfo.name}</p>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline">Logout</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Want to continue?</AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel >Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleLogout}>Logout</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog></>
          )
          : (<AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline">Login</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Login now</AlertDialogTitle>
                <AlertDialogDescription className=''>
                  <div className="flex justify-center items-center mt-9">
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full sm:w-2/3 md:w-2/3 space-y-6">
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input placeholder="email" className='outline outline-1' {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl >
                                <div className='relative'>
                                  <Input placeholder="Password" className='outline outline-1 '{...field} type={showPassword ? "text" : "password"} />
                                  <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="absolute text-xl inset-y-5 right-2 flex items-center px-2 text-gray-500"
                                  >
                                    {showPassword ? (<FaEyeSlash />) : (<FaEye />)}
                                  </button>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}

                        />
                        {isLoggingIn
                          ? (<div className="flex items-center justify-center gap-3">
                            <Spinner size="medium" />
                          </div>)
                          : <>
                            <div className="flex justify-center">
                              <Button type="submit" className='w-full mt-10'>Login</Button>
                            </div>
                            <div onClick={() => GoogleSignup()} className='cursor-pointer'>
                              <a
                                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                              >
                                <span className="mr-2">Sign in with Google</span>

                                <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" width="0.98em" height="1em" viewBox="0 0 256 262"><path fill="#4285f4" d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622l38.755 30.023l2.685.268c24.659-22.774 38.875-56.282 38.875-96.027" /><path fill="#34a853" d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055c-34.523 0-63.824-22.773-74.269-54.25l-1.531.13l-40.298 31.187l-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1" /><path fill="#fbbc05" d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82c0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602z" /><path fill="#eb4335" d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0C79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251" /></svg>
                              </a>
                            </div>
                          </>}
                        <AlertDialogCancel ref={loginModalClose} className='w-full mt-10' onClick={() => setIsLoggingIn(false)}>Cancel</AlertDialogCancel>
                        <p className='text-center'>new user?<NavLink to='/signup' className="p-2 text-blue-500">Signup</NavLink></p>
                      </form>
                    </Form>
                  </div>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog >)
        }
      </div>
    </div>

  )
}

export default Navbar