import './assets/scss/style.scss';
import React, { useState, useEffect } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
//import 'react-tabs/style/react-tabs.css';
import _ from 'lodash';



function App() {

  const [folders, setFolders] = useState([]);
  const [images, setImages] = useState({});

  useEffect(() => {

    fetch(`https://7da7-119-18-0-196.au.ngrok.io/api/v1/byob/listfiles`)
      .then(response => response.json())
      .then(jsonResponse => {
        setImages(jsonResponse.data);
        setFolders(jsonResponse.data.images);
      })
      .catch(error => console.error(error));
  }, []);

  function handleClick(url) {

    const folder = url.split('|')[0];
    const divFolder = (document.getElementById(folder));
    const divs = divFolder.getElementsByTagName('div');

    for (let i = 0; i < divs.length; i++) {
      divs[i].style.display = 'none';
    }

    document.getElementById(url).style.display = 'block';

  }

  return (
    <div className="App">
      <Tabs>
        <TabList>
          {
            Object.keys(folders).map((item) => <Tab>{item}</Tab>)
          }
        </TabList>
        {
          Object.keys(folders).map((folder) => {

            let url = "https://byob-boop-dev.s3.ap-southeast-2.amazonaws.com/" + encodeURIComponent(folder) + "/"
            return (<TabPanel>
              {
                images.images[folder].images.filter(f => f.indexOf('.png') >= 0).map(i => <Thumbnail imageSrc={url + encodeURIComponent(i)} onClick={() => handleClick(folder + '|' + i)} />)
              }
            </TabPanel>)
          }
          )
        }
      </Tabs>
      <div className="canva">
        <div className="nft-container">
          <div className="nft-layers">
            {
              Object.keys(folders).map((folder, indexFolder) => {



                let url = "https://byob-boop-dev.s3.ap-southeast-2.amazonaws.com/" + encodeURIComponent(folder) + "/"
                return (<div style={{ zIndex: indexFolder, position: 'relative' }} id={folder}>
                  {
                    images.images[folder].images.filter(f => f.indexOf('.png') >= 0).map((imagem, index) => {

                      const urlForImage = `url(${url + encodeURIComponent(imagem)})`;



                      return (<div id={folder + '|' + imagem} className="nft-layer" style={{ backgroundImage: urlForImage, display: index == 0 ? 'block' : 'none' }} ></div>);

                    })
                  }
                </div>)
              }
              )
            }

          </div>
        </div>
      </div>
    </div>
  );
}

function Thumbnail(props) {
  const { imageSrc, onClick } = props;

  return (
    <button className="thumbnail-button" onClick={onClick}>
      <div className="thumbnail" style={{ backgroundImage: `url(${imageSrc})` }}></div>
    </button>
  );
}



export default App;
