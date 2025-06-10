import { SignIn } from '@clerk/nextjs'

export default function Page() {
  return <div className='min-h-screen flex flex-col justify-center items-center' > <SignIn /> </div>
}
