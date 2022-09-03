export default function MenuItem(props: any) {
    return (
      <a className={'flex items-center py-2 px-4 rounded hover:bg-gray-200 cursor-pointer '+props.className} onClick={props.onClick}>
          {props.icon && 
          <div className='text-2xl inline-block mr-3 text-gray-700'>
              {props.icon}
          </div>}
          {props.children}
      </a>
    )
  }