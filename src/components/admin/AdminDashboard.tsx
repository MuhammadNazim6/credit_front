import Api from '@/services/api'
import React, { useEffect, useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from '../ui/button'
import { useToast } from '../ui/use-toast'

const dashlist = [
  'Borrowers', 'Loans', 'Repayments', 'Loan parameters', 'Accounting', 'Reports', 'Collateral', 'Access Configuration', 'Savings', 'Investor accounts', 'Settings', 'Sign out'
]

const AdminDashboard = () => {

  const [loans, setLoans] = useState([])
  useEffect(() => {
    fetchloans()
  }, [])
  const { toast } = useToast()

  const fetchloans = async () => {
    const response = await Api.get('/admin/all-loans')
    if (response.data.success) {
      setLoans(response.data.data)
    }
  }

  const updateLoanList = async (e, loanId) => {
    // updating db
    const data = {
      status: e,
      loanId
    }
    const response = await Api.patch('/admin/changeStatus', data)
    if (response.data.success) {
      let tempLoans = loans.map((loan) => {
        if (loan._id === loanId) {
          loan.loanStatus = e
        }
        return loan
      })
      setLoans(tempLoans)
      toast({
        variant: "default",
        title: "Status updated.",
      })
    }
  }



  return (
    <>
      <div className="flex h-screen">
        <div className="w-64 bg-green-800 text-white">
          <div className="p-6">
            <h2 className="text-2xl font-semibold">Dashboard</h2>
          </div>
          <ul className="space-y-1 px-6">
            {dashlist.map((item, index) => (
              <li key={index}>
                <span className="block p-2 hover:bg-gray-700 rounded">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex-1 p-10 bg-gray-100">
          <h1 className="text-3xl font-semibold">Dashboard</h1>
          <div className="">
            <div className="flex justify-around mt-10">
              <div className="h-20 bg-green-800 w-64 rounded-lg flex">
                <div className="w-1/3 text-2xl flex items-center justify-center">ICON</div>
                <div className="w-2/3 bg-white text-xl pl-4 pt-2"><p>100</p><p className='text-lg'>Active users</p></div>
              </div>
              <div className="h-20 bg-green-800 w-64 rounded-lg flex">
                <div className="w-1/3 text-xl flex items-center justify-center">ICON</div>
                <div className="w-2/3 bg-white text-xl pl-4 pt-2"><p>100</p><p className='text-lg'>Borrowers</p></div>
              </div>
              <div className="h-20 bg-green-800 w-64 rounded-lg flex">
                <div className="w-1/3 text-xl flex items-center justify-center">ICON</div>
                <div className="w-2/3 bg-white text-xl pl-4 pt-2"><p>100</p><p className='text-lg'>Cash Dibursed</p></div>
              </div>
              <div className="h-20 bg-green-800 w-64 rounded-lg flex">
                <div className="w-1/3 text-xl flex items-center justify-center">ICON</div>
                <div className="w-2/3 bg-white text-xl pl-4 pt-2"><p>100</p><p className='text-lg'>Cash recieved</p></div>
              </div>
            </div>


            <div className="flex justify-around mt-4">
              <div className="h-20 bg-green-800 w-64 rounded-lg flex">
                <div className="w-1/3 text-xl flex items-center justify-center">ICON</div>
                <div className="w-2/3 bg-white text-xl pl-4 pt-2"><p>100</p><p className='text-lg'>Active users</p></div>
              </div>
              <div className="h-20 bg-green-800 w-64 rounded-lg flex">
                <div className="w-1/3 text-xl flex items-center justify-center">ICON</div>
                <div className="w-2/3 bg-white text-xl pl-4 pt-2"><p>100</p><p className='text-lg'>Borrowers</p></div>
              </div>
              <div className="h-20 bg-green-800 w-64 rounded-lg flex">
                <div className="w-1/3 text-xl flex items-center justify-center">ICON</div>
                <div className="w-2/3 bg-white text-xl pl-4 pt-2"><p>100</p><p className='text-lg'>Cash Dibursed</p></div>
              </div>
              <div className="h-20 bg-green-800 w-64 rounded-lg flex">
                <div className="w-1/3 text-xl flex items-center justify-center">ICON</div>
                <div className="w-2/3 bg-white text-xl pl-4 pt-2"><p>100</p><p className='text-lg'>Cash recieved</p></div>
              </div>
            </div>


            <div className="flex justify-center mt-10">
              <div className="w-4/5">
                <table className="min-w-full table-auto">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="px-4 py-2 text-left">User</th>
                      <th className="px-4 py-2 text-left">Amount</th>
                      <th className="px-4 py-2 text-left">Date</th>
                      <th className="px-4 py-2 text-left">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loans.length > 0 &&
                      (loans.map((loan) => {
                        return <tr className="border-b">
                          <td className="px-4 py-2 flex items-center">
                            <img src="https://via.placeholder.com/40" alt="Officer Image" className="w-10 h-10 rounded-full mr-3" />
                            <span>{loan.fullName}</span>
                          </td>
                          <td className="px-4 py-2">Rs:{loan.loanAmount}</td>
                          <td className="px-4 py-2">{`${String(new Date(loan.createdAt).getDate()).padStart(2, '0')}-${String(new Date(loan.createdAt).getMonth() + 1).padStart(2, '0')}-${new Date(loan.createdAt).getFullYear()}`}</td>
                          <td className="px-4 py-2">

                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="outline" className={`px-3 py-1 rounded-md ${loan.loanStatus === "Pending" ? "bg-yellow-100 text-yellow-800" :
                                  loan.loanStatus === "Verified" ? "bg-green-100 text-green-800" :
                                    loan.loanStatus === "Rejected" ? "bg-red-100 text-red-800" :
                                      loan.loanStatus === "Approved" ? "bg-blue-100 text-blue-800" :
                                        "bg-gray-100 text-gray-800"
                                  }`}>{loan.loanStatus}</Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent className="w-56">
                                <DropdownMenuLabel>Loan status</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuRadioGroup value={loan.loanStatus} onValueChange={(e) => updateLoanList(e, loan._id)}>
                                  <DropdownMenuRadioItem value="Pending">Pending</DropdownMenuRadioItem>
                                  <DropdownMenuRadioItem value="Verified">Verified</DropdownMenuRadioItem>
                                  <DropdownMenuRadioItem value="Rejected">Rejected</DropdownMenuRadioItem>
                                  <DropdownMenuRadioItem value="Approved">Approved</DropdownMenuRadioItem>
                                </DropdownMenuRadioGroup>
                              </DropdownMenuContent>
                            </DropdownMenu>

                          </td>
                        </tr>
                      }))}
                  </tbody>
                </table>
                {loans.length === 0 && <p className='text-center mt-10 text-md'>No loans applied</p>}
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  )
}

export default AdminDashboard

