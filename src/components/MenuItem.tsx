export default function MenuItem(props: any) {
    let style = 'hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center py-2 px-4 rounded cursor-pointer ';

    if(props.active)
      style += 'bg-gray-200 dark:bg-gray-700 font-semibold ';

    return (
      <a className={style + props.className} onClick={props.onClick}>
          {props.icon && 
          <div className='text-2xl inline-block mr-3'>
              {props.icon}
          </div>}
          {props.children}
      </a>
    )
  }