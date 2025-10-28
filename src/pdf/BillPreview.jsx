import React from 'react'
import {  PDFViewer } from '@react-pdf/renderer';
import Bill from './Bill';
const Billpreview = () => (
    <PDFViewer width="100%" height="1000">
      <Bill />
    </PDFViewer>
  )
export default Billpreview