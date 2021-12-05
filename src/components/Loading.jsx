export const Loading = (props) => {
  return (
    <div className={'popup'} 
        style={{
          width:'100%',
          height:'100%',
          position:'fixed',
          top:'0',
          left:'0',
          right:'0',
          bottom:'0',
          backgroundColor:'rgba(255,255,255,0.5)',
          dispaly:'flex'
      }}>
        <div className={'main'} 
            style={{
                width:'200px',
                height:'200px',
                backgroundColor:'#fff',
                borderRadius:'20px',
                position:'absolute',
                top:'50%',
                left:'50%',
                marginTop:'-100px',
                marginLeft:'-100px',
                padding:'20px',
                display: 'inline-block'
            }}>
          <img style={{
                  width:'100%',
                  height:'100%'}} 
                alt='1oading' src={require('./bfab3f9f504c3d6e6e88a8ac39477432.gif').default} />
          <h2>Loading Data ...</h2>
        </div>    
    </div>
)

}