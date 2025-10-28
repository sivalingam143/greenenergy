import { Helmet } from "react-helmet";

const Title = ({title}) => {
  return (
    <>
        <Helmet>
            <title>{title}</title>
            <meta name="description" content="Srivaru Admin Dashboard" />
            <meta name="keywords" content="Srivaru, Admin, Dashboard" />
            <meta name="author" content="Srivaru Team" />
            <link rel="icon" href="/favicon.ico" />
        </Helmet>
    </>
  )
}

export default Title