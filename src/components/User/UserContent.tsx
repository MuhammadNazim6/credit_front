import React, { useEffect, useRef, useState } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Api from '@/services/api'
import { useToast } from "@/components/ui/use-toast"
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'



const UserContent = () => {
  const [userLoans, setUserLoans] = useState([])
  const { toast } = useToast()
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });
  const { userInfo } = useSelector((state: RootState) => state.auth)
  const loanModalClose = useRef()


  useEffect(() => {
    fetchUserLoans()
  }, [])

  const fetchUserLoans = async () => {
    const response = await Api.get(`/user/loans/${userInfo._id}`)
    if (response.data.success) {
      console.log(response.data.data);
      setUserLoans(response.data.data)
    }
  }

  const onSubmit = async (data) => {
    const response = await Api.post('user/loan-request', { ...data, userId: userInfo._id })
    if (response.data.success) {
      fetchUserLoans()
      if (loanModalClose.current) loanModalClose.current.click()
      toast({
        variant: "default",
        title: "Your loan request has been sent.",
        description: 'Kindly wait for response from the admin',
      })
    }
  };


  return (
    <>
      <div className="flex justify-center">
        <div className="h-32 mt-20 w-2/5 flex justify-between">
          <div className="bg-green-200 h-20 p-3">
            <p>Deficit</p>
            <p>{userLoans.length && (userLoans.reduce((a,c)=> a.loanAmount + c.loanAmount))}</p>          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline">Get a loan</Button>
            </AlertDialogTrigger>
            <AlertDialogContent className='w-full max-w-7xl'>
              <AlertDialogHeader>
                <AlertDialogTitle>Request for a loan now.</AlertDialogTitle>
                <AlertDialogDescription >

                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex justify-center space-x-36 mt-10 px-10">
                      <div className="w-2/3">
                        <p className='pb-2'>Full name as it appears on bank account</p>
                        <Input {...register("fullName")} className=' outline outline-2' />
                        {errors.fullName && <p className="text-red-600 mt-2">{errors.fullName.message}</p>}
                      </div>
                      <div className="w-2/3">
                        <p className='pb-2'>How much do you need?</p>
                        <Input type='number' {...register("loanAmount")} className=' outline outline-2' />
                        {errors.loanAmount && <p className="text-red-600 mt-2">{errors.loanAmount.message}</p>}
                      </div>
                    </div>

                    <div className="flex justify-center space-x-36 mt-10 px-10">
                      <div className="w-2/3">
                        <p className='pb-2'>Loan tenure (in months)</p>
                        <Input {...register("tenure")} className=' outline outline-2' />
                        {errors.tenure && <p className="text-red-600 mt-2">{errors.tenure.message}</p>}
                      </div>
                      <div className="w-2/3">
                        <p className='pb-2'>Employment status</p>
                        <Input {...register("employmentStatus")} className=' outline outline-2' />
                        {errors.employmentStatus && <p className="text-red-600 mt-2">{errors.employmentStatus.message}</p>}
                      </div>
                    </div>

                    <div className="flex justify-center space-x-36 mt-10 px-10">
                      <div className="w-2/3">
                        <p className='pb-2'>Reason for loan</p>
                        <Textarea {...register("reason")} className=' outline outline-2' />
                        {errors.reason && <p className="text-red-600 mt-2">{errors.reason.message}</p>}
                      </div>
                      <div className="w-2/3">
                        <p className='pb-2'>Employment address</p>
                        <Textarea {...register("employmentAddress")} className=' outline outline-2' />
                        {errors.employmentAddress && <p className="text-red-600 mt-2">{errors.employmentAddress.message}</p>}
                      </div>
                    </div>

                    <div className="flex justify-center space-x-36 mt-10 px-48">
                      <div className="flex items-center space-x-5">
                        <Checkbox id="terms" />
                        <label htmlFor="terms" className="text-sm font-medium leading peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          I have read the important information and accept that by completing the application I will be bound by terms.
                        </label>
                      </div>

                      <div className="flex items-center space-x-5">
                        <Checkbox id="conditions" />
                        <label htmlFor="conditions" className="text-sm font-medium leading peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          Any personal and credit information obtained may be disclosed from time to time to other lenders, credit bureaus or other credit reporting agencies.
                        </label>
                      </div>
                    </div>

                    <div className="mt-10 text-center flex  justify-center space-x-7">
                      <Button type="submit">Submit</Button>
                      <AlertDialogCancel ref={loanModalClose}>Cancel</AlertDialogCancel>
                    </div>
                  </form>

                </AlertDialogDescription>
              </AlertDialogHeader>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      <div className="h-11 flex justify-center">
        <div className="w-2/5 flex justify-around border-2 p-2 shadow-xl rounded-md">
          <p>Borrow Cash</p>
          <p>Transact</p>
          <p>Deposit cash</p>
        </div>
      </div>
      <div className="flex justify-center mt-4">
        <div className="w-2/5 flex justify-around ">
          <Input className='outline outline-1 mt-2 shadow-lg' placeholder='Search for loans' />
        </div>
      </div>

      <div className="h-full flex justify-center mt-10">
        <div className="w-4/5 flex justify-around border-2 p-2 shadow-xl rounded-md">
          <div className="flex justify-between w-full p-3">
            <p className='font-bold text-lg'> Applied loans</p>
            <p className='flex space-x-6'>
              <p>Sort</p>
              <p>Filter</p>
            </p>
          </div>
        </div>
      </div>



      <div className="flex justify-center">
        <div className="w-4/5">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2 text-left">Loan Officer</th>
                <th className="px-4 py-2 text-left">Amount</th>
                <th className="px-4 py-2 text-left">Date Applied</th>
                <th className="px-4 py-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {userLoans.length > 0 &&
                (userLoans.map((loan) => {
                  return <tr className="border-b">
                    <td className="px-4 py-2 flex items-center">
                      <img src="https://via.placeholder.com/40" alt="Officer Image" className="w-10 h-10 rounded-full mr-3" />
                      <span>{loan.fullName}</span>
                    </td>
                    <td className="px-4 py-2">Rs:{loan.loanAmount}</td>
                    <td className="px-4 py-2">{`${String(new Date(loan.createdAt).getDate()).padStart(2, '0')}-${String(new Date(loan.createdAt).getMonth() + 1).padStart(2, '0')}-${new Date(loan.createdAt).getFullYear()}`}</td>
                    <td className="px-4 py-2">
                      <span
                        className={`px-3 py-1 rounded-full ${loan.loanStatus === "Pending" ? "bg-yellow-100 text-yellow-800" :
                          loan.loanStatus === "Verified" ? "bg-green-100 text-green-800" :
                            loan.loanStatus === "Rejected" ? "bg-red-100 text-red-800" :
                              loan.loanStatus === "Approved" ? "bg-blue-100 text-blue-800" :
                                "bg-gray-100 text-gray-800"
                          }`}
                      >
                        {loan.loanStatus}
                      </span>
                    </td>
                  </tr>
                }))}
            </tbody>
          </table>
          {userLoans.length === 0 && <p className='text-center mt-10 text-md'>No loans applied</p>}
        </div>
      </div>
    </>
  )
}

export default UserContent


const schema = yup.object().shape({
  fullName: yup.string().required("Full name is required"),
  loanAmount: yup.number()
    .typeError("Loan amount must be a number")
    .positive("Loan amount must be a positive number")
    .min(2000, "Loan amount must be greater than 2000")
    .integer("Loan amount must be an integer")
    .nullable(),
  tenure: yup.number().required("Loan tenure is required").typeError("Loan tenure must be a number").max(50, "Loan tenure must be less than 50"),
  employmentStatus: yup.string().required("Employment status is required"),
  reason: yup.string().required("Reason for loan is required"),
  employmentAddress: yup.string().required("Employment address is required"),
});