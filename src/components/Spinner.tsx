import React, { CSSProperties } from 'react'
import { ClipLoader } from 'react-spinners';

const spinnerStyle: CSSProperties = {
    display: "block",
    margin: "0 auto"
};

export default function Spinner(props: any) {
  return (
    <ClipLoader color={'#3b82f6'} loading={props.loading} cssOverride={spinnerStyle} size={50} />
  )
}
