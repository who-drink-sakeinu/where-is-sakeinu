import './App.css'
import { queryTokensInQueue, queryTotalSupply } from './contract/sakeinu'
import { rarity } from './assets/info';
import { useState, useEffect } from 'react';
import BaseImg from './assets/base.jpg';

interface NftInfo {
  bigId: string;
  id: number;
  rarity: string;
}

interface RarityInfo {
  base: number[];
  core: number[];
  epic: number[];
  legendary: number[];
}

function App() {
  const [nftInfos, setNftInfos] = useState<NftInfo[]>([]);
  const [queueRarityInfo, setQueueRarityInfo] = useState<RarityInfo>({base: [], core: [], epic: [], legendary: []});

  useEffect(() => {

    queryTokensInQueue().then((strIds) => {
      const rInfo: RarityInfo = {
        base: [],
        core: [],
        epic: [],
        legendary: []
      };
      const nInfos = (strIds as string[]).map((id, index) => {
        const numId = Number(BigInt(id) - 2n ** 255n)
        const nInfo ={
          bigId: id,
          id: numId,
          rarity: rarity[numId-1],
        }

        switch (nInfo.rarity) {
          case "Base":
            rInfo.base.push(strIds.length - index);
            break;
          case "Core":
            rInfo.core.push(strIds.length - index);
            break;
          case "Epic":
            rInfo.epic.push(strIds.length - index);
            break;
          case "Legendary":
            rInfo.legendary.push(strIds.length - index);
            break;
        }

        return nInfo
      })

      setQueueRarityInfo(rInfo);
      setNftInfos(Array.from(nInfos).reverse());
    })
  }, []);

  const [totalSupply, setTotalSupply] = useState<number>(0);
  const [unmintedInfos, setUnmintedNftInfos] = useState<NftInfo[]>([]);
  const [unmintedRarityInfo, setUnmintedRarityInfo] = useState<RarityInfo>({base: [], core: [], epic: [], legendary: []});

  useEffect(() => {
    queryTotalSupply().then((totalSupply) => {
      setTotalSupply(totalSupply)

      const uninfos: NftInfo[] = [];
      const rInfo: RarityInfo = {
        base: [],
        core: [],
        epic: [],
        legendary: []
      };
      for(let i = totalSupply+1; i <= 10000; i++) {
        const unmintedNftInfo = {
          bigId: (BigInt(i) + 2n**255n).toString(),
          id: i,
          rarity: rarity[i-1],
        }
        uninfos.push(unmintedNftInfo)

        switch (unmintedNftInfo.rarity) {
          case "Base":
            rInfo.base.push(i - totalSupply);
            break;
          case "Core":
            rInfo.core.push(i - totalSupply);
            break;
          case "Epic":
            rInfo.epic.push(i - totalSupply);
            break;
          case "Legendary":
            rInfo.legendary.push(i - totalSupply);
            break;
        }
      }

      setUnmintedNftInfos(uninfos)
      setUnmintedRarityInfo(rInfo)
    })
  }, [totalSupply])

  return (
    <div className="app-container">
      <div className="info-section">
        <h1>Where is SAKEINU 🍶</h1>
        <div className="queue-info">
          <h3>Queue ({nftInfos.length})</h3>
          <h4>- Base: {queueRarityInfo.base.length}</h4>
          <h4>- Core: {queueRarityInfo.core.length} [{queueRarityInfo.core.join(", ")}]</h4>
          <h4>- Epic: {queueRarityInfo.epic.length} [{queueRarityInfo.epic.join(", ")}]</h4>
          <h4>- Legendary: {queueRarityInfo.legendary.length} [{queueRarityInfo.legendary.join(", ")}]</h4>
        </div>
  
        <div className="image-row">
          {nftInfos.map((nftInfo, index) => (
            <div key={nftInfo.id} className="image-item">
              <p>{index + 1}</p>
              <a target="_blank" href={`https://pallet.exchange/collection/sakeinu/${nftInfo.bigId}`}><p># {nftInfo.id}</p></a>
              {(nftInfo.rarity === "Base") ?
              <img src={BaseImg} alt={`Token ${nftInfo.id}`} /> :
              <img src={`https://s3.ap-northeast-2.amazonaws.com/asset.sakeinu.ai/mobile/detail686x686/${nftInfo.id}.jpg`}
                   alt={`Token ${nftInfo.id}`} />}
            </div>
          ))}
        </div>
  
        <div className="remained-info">
          <h3>Unminted ({10000 - totalSupply})</h3>
          <h4>- Base: {unmintedRarityInfo.base.length}</h4>
          <h4>- Core: {unmintedRarityInfo.core.length} [{unmintedRarityInfo.core.join(", ")}]</h4>
          <h4>- Epic: {unmintedRarityInfo.epic.length} [{unmintedRarityInfo.epic.join(", ")}]</h4>
          <h4>- Legendary: {unmintedRarityInfo.legendary.length} [{unmintedRarityInfo.legendary.join(", ")}]</h4>
        </div>
  
        <div className="image-row">
          {unmintedInfos.map((nftInfo, index) => (
            <div key={nftInfo.id} className="image-item">
              <p>{index + 1}</p>
              <a target="_blank" href={`https://pallet.exchange/collection/sakeinu/${nftInfo.bigId}`}><p># {nftInfo.id}</p></a>
              {(nftInfo.rarity === "Base") ?
              <img src={BaseImg} alt={`Token ${nftInfo.id}`} /> :
              <img src={`https://s3.ap-northeast-2.amazonaws.com/asset.sakeinu.ai/mobile/detail686x686/${nftInfo.id}.jpg`}
                   onError={(event: React.SyntheticEvent<HTMLImageElement>) => {
                     event.currentTarget.src = "https://s3.ap-northeast-2.amazonaws.com/asset.sakeinu.ai/mobile/detail686x686/base.jpg";
                   }}
                   alt={`Token ${nftInfo.id}`} />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;