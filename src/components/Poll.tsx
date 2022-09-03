import React from 'react'
import { IoMdThumbsDown, IoMdThumbsUp } from 'react-icons/io'
import Button from './Button'
import Card from './Card'

export default function Poll(props: any) {
  return (
    <Card size='sm' className={props.className}>
        <div className="mb-4 flex items-end">
            <img src={props.data.profileImage} alt="" className="w-12 h-12 rounded-full shadow-md mr-3"/>
            <a className='text-xl font-medium'>@{props.data.name}</a>
        </div>
        <span className='text-3xl'>{props.data.question}</span>
        <div className="mt-4 flex space-x-5">
            <Button onClick={() => {}} type="outline" className='grow' icon={<IoMdThumbsUp />}>Yes</Button>
            <Button onClick={() => {}} type="outline" className='grow' icon={<IoMdThumbsDown />}>No</Button>
        </div>
    </Card>
  )
}
