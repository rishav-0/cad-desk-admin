import React from 'react'
import {
    Accordion,
    AccordionHeader,
    AccordionBody,
  } from "@material-tailwind/react";

const ReuseAccordian = ({header,body,id,handleOpen,open,icon}) => {
  return (
    <Accordion key={id} open={open === id} className='bg-gray-100 p-2 rounded-md my-2' icon={icon}>
          <AccordionHeader onClick={() => handleOpen(id)} className='py-0 border-0 para-bold'>
            {header}
          </AccordionHeader>
          <AccordionBody className='text-sm py-0'>
            {body}
          </AccordionBody>
        </Accordion>
  )
}

export default ReuseAccordian