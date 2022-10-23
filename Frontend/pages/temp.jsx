export default function Temp(props) {
  return <h1>Hello world</h1>;
}

export async function getStaticProps(context) {
  console.log(context.params); // return { movieId: 'Mortal Kombat' }
  return {
    props: {}, // will be passed to the page component as props
  };
}
