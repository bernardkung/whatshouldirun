import { useState, useEffect, useMemo } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import loot from './tww_s2_loot.json'
import specs from './specs.json'
import charClasses from './class_specs.json'
import dungeonPool from './tww_s2_dungeons.json'

const equipmentTypes = [
  'head',
  'neck',
  'shoulders',
  'back',
  'chest',
  'wrists',
  'hands',
  'waist',
  'legs',
  'feet',
  'finger',
  'trinket',
  'main_hand',
  'off_hand',
]


function App() {
  
  //////////////////////////// STATES ////////////////////////////
  const [ activeSpec, setActiveSpec ] = useState()
  const [ specOptions, setSpecOptions ] = useState([])
  const [ targetItems, setTargetItems ] = useState([])
  const [ activeItemId, setActiveItemId ] = useState()
  const [ tooltipVisible, setTooltipVisible ] = useState(false)
  const [ tooltipPosition, setTooltipPosition ] = useState({top: 0, left: 0})
  const [ dungeons, setDungeons ] = useState(
    dungeonPool.map((dungeon, d)=>{
      return {
        'name': dungeon['name'],
        'value': dungeon['value'],
        'lootPool': getLootPool(dungeon)
      }
    }).sort((a, b)=>b['lootPool'].length - a['lootPool'].length)
  )

  // const equipmentIconLinks = equipmentTypes.map((equipmentType, e=>`Ui-paperdoll-slot-${equipmentType}.webp`))
  
  
  //////////////////////////// FUNCTIONS ////////////////////////////
  function prettifyText(inStr) {
    // Split on dash, and capitalize each word
    return inStr.split("_").map((word, w)=>{
      return String(word).charAt(0).toUpperCase() + String(word).slice(1)
    }).join(" ") 
  }

  // Find the class and spec matching target    
  function findClassSpec (target ) {
    // Split out class and spec from div value
    const targetClass = target.split(/-(.*)/s)[1]
    const targetSpec  = target.split(/-(.*)/s)[0]
    // Search for the right class
    const matchClass = specs.find((classSpec)=>{
      return classSpec['className'] === targetClass
    })
    // Search for the right spec
    const matchSpec = matchClass['specialization'].find((spec)=>{
      return spec['specName'] === targetSpec
    })
    // Build a new classSpec dict for state
    return {
      'className': matchClass['className'],
      'classSpec': `${target}`,
      ...matchSpec
    }
  }

  const findItem = ( id )=>{
    // TBD: id and item['id'] have different types
    return loot.find((item)=>{
      return item['id'] == id
    })
  }

  //////////////////////////// EFFECTS ////////////////////////////
  useEffect(()=>{
    setSpecOptions(
      specs.map((charClass, c)=>{
        const classSpecs = charClass['specialization']
        return classSpecs.map(( spec, s ) => { 
          return `${spec['specName']}-${charClass['className']}` 
        })
      }).flat()
    )
  }, [])

  useEffect(()=>{
    // Update lootpool
    setDungeons(
      dungeonPool.map((dungeon, d)=>{
        return {
          'name': dungeon['name'],
          'value': dungeon['value'],
          'lootPool': getLootPool(dungeon)
        }
      }).sort((a, b)=>b['lootPool'].length - a['lootPool'].length)
    )
  }, [activeSpec, targetItems])
  

  //////////////////////////// EVENT HANDLERS ////////////////////////////

  const onClick = (e)=>{
    const targetItem = e.target.id
    // Update targetItems
    if (targetItems.includes(targetItem) === false) {
      setTargetItems([...targetItems, targetItem])
    } else {
      setTargetItems([...targetItems.filter(i => i !== targetItem)])
    }
  }
  
  const onSpecClick = (e)=>{   
    if (!activeSpec) {
      setActiveSpec(findClassSpec(e.target.id))
    }
    else {
      activeSpec['classSpec'] === e.target.id
        ? setActiveSpec(null)
        : setActiveSpec(findClassSpec(e.target.id))
    }
  }

  const onItemEnter = (e)=>{
    var rect = e.target.getBoundingClientRect();
    console.log(rect.top, rect.right, rect.bottom, rect.left);
    setTooltipPosition({
      top: rect.top,
      left: rect.right
    })
    setTooltipVisible(true)
    setActiveItemId(e.target.id)
  }

  const onItemLeave = (e)=>{
    setActiveItemId(null)
  }

  //////////////////////////// DIVS ////////////////////////////
  
  const specOptionsImgs = specOptions.map((spec,s)=>{
    const isActiveSpec = activeSpec 
      ? spec === activeSpec['classSpec'] 
        ? true 
        : false
      : false
    return (
      <img 
        key={s}
        className={`specIcon ${isActiveSpec ? 'active' : 'inactive'}`}
        src={ `/images/class_icons/${spec}.png` } 
        alt={ spec }
        id={ spec }
        onClick={onSpecClick}
      />
    )
  })

  
  const groupedSpecOptionsImgs = charClasses.map((charClass,c)=>{
    return (
      <div key={c}>
        <h2>{ prettifyText(charClass['class']) }</h2>
        { charClass['specializations'].map((spec, s)=>{
          const isActiveSpec = activeSpec 
            ? spec === activeSpec['specName'] 
              ? true 
              : false
            : false
          return (
            <img 
              key={s}
              className={`specIcon ${isActiveSpec ? 'active' : 'inactive'}`}
              src={ `/images/class_icons/${spec}_${charClass['class']}.png` } 
              alt={ spec }
              id={ spec }
              onClick={onSpecClick}
            />
          )
        })}
      </div>
    ) 
  })


  const equipmentDivs = equipmentTypes.map((equipmentType, e)=>{
    return (
      <div key={e} className={'equipSlotGroup'}>
        <img 
          key={`img${e}`} 
          src={`/images/equipment_slots/Ui-paperdoll-slot-${equipmentType}.webp`}
          id={equipmentType}
          onClick={onClick}
          className={ `equipSlotIcon ${targetItems.includes(equipmentType) ? 'active' : ''}` }
        ></img>
        <p 
          key={e} 
          className={`${targetItems.includes(equipmentType) ? 'equipSlotLabel active' : 'equipSlotLabel'}`}
        >
          { equipmentType }
        </p>
      </div>
    )
  })

  
  const lootTooltip = () => {
    return (
      <div 
        className={`lootTooltip ${!tooltipVisible ? 'aa' : 'bb'}`}
        // style={{top: tooltipPosition.top, left: tooltipPosition.left}}
        style={{top: 0, left: 0}}
      >          
        <p 
          className={``}
          id={activeItemId}
        >
          { findItem(activeItemId)['name'] }
        </p>
      </div>
    )
  }

  function getLootPool(dungeon) {
    // Get loot which matches the dungeon & targetItems, mainStat, and role

    function dungeonFilter(item) {
      return item['dungeon'] === dungeon['value']
    }

    function targetItemsFilter(item) {
      // if no targetItems selected, show all
      return targetItems.length === 0 || targetItems.includes(item['slot'])
    }

    
    function weaponFilter(item) {
      // if activeSpec selected, weapon must be in class-compatible weapon list
      return !activeSpec || activeSpec['weapons'].includes(item['type'])
    }

    function specFilter(item) {
      // if activeSpec selected, item must match mainStat and role
      return !activeSpec 
        || (
          item['main_stat'].includes(activeSpec['mainStat']) 
          && item['role'].includes(activeSpec['role']) 
          && (
            item['category']===activeSpec['armor'] 
            || item['category']==='accessory'
            || weaponFilter(item)
          )
        )

    }

    // troubleshooting item filter
    if (dungeon['value'] === 'brew' && activeSpec && targetItems.length > 0) {
      loot.filter((item, i)=>dungeonFilter(item)).map((item, i)=>{
        console.log(item, dungeonFilter(item), targetItemsFilter(item), specFilter(item))
        // console.log(!activeSpec, item['main_stat'].includes(activeSpec['mainStat']), item['role'].includes(activeSpec['role']))
      })
    }

    const lootPool = loot.filter((item, i)=>{
      return dungeonFilter(item) && targetItemsFilter(item) && specFilter(item)
    })

    return lootPool
  }

  const dungeonDivs = dungeons.map((dungeon, d)=>{
    // Build divs for each item in loot pool
    const lootDivs = dungeon['lootPool'].map((item, i)=>{
      return (
        <div key={i} className={'lootItem'}>
          <img 
            key={`img${i}`} 
            src={`/images/equipment_slots/Ui-paperdoll-slot-${item['slot']}.webp`}
            alt={item['name']}
            id={item['id']}
            className={'lootIcon'}
            onMouseEnter={onItemEnter}
            // onMouseLeave={onItemLeave}
          ></img>
        </div>
      )
    })

    // const lootTooltips = lootPool.map((item, i)=>{
    //   return (
    //     <div 
    //       key={`tooltip${i}`}
    //       className={`lootTooltip ${activeItemId == item['id'] ? 'active' : 'inactive'}`}>          
    //       <p 
    //         key={`name${i}`} 
    //         className={`lootName ${activeItemId == item['id'] ? 'active' : 'inactive'}`}
    //         id={item['id']}
    //       >
    //         { item['name'] }
    //       </p>
    //     </div>
    //   )
    // })

    // Build divs for each dungeon
    return (
      <div key={`group${d}`} className={'dungeonGroup'}>
        <img
          key={`banner${d}`}
          className={`dungeonGroupBanner ${dungeon['lootPool'].length > 0 ? 'active' : 'inactive'}`}
          src={`/images/dungeons/${dungeon['value']}.png`}
        >
        </img>
        <p
          key={d}
          className={`dungeonGroupTitle ${dungeon['lootPool'].length > 0 ? 'active' : 'inactive'}`}
        >
          {dungeon.name}
        </p>
        <div className={'lootGroup'}>
          {lootDivs}
        </div>
        {/* { lootTooltip } */}
      </div>
    )
  })


  function testFx(){
    console.log(!activeSpec)
  }


  // App Body
  return (
    <>
      <h1><img className={'titleLogo'} src={'./thinking.svg'} onClick={testFx}/> What Should I Run? </h1>
      
      <div className={'specContainer'}>
        {/* <label id="charClassSpinnerLabel">I'm playing a </label>
        <select id="charClassSpinner" onInput={onChange}>
          <option value={ null } ></option>
          { specOptionsDivs }
        </select> */}
        { specOptionsImgs}
        {/* { groupedSpecOptionsImgs} */}
      </div>


      <div className={'container'}>
        <div className={'equipmentContainer'}>
          <h2>I am looking for</h2>
          { equipmentDivs }
        </div>

        <div className={'dungeonContainer'}>
          <h2>I should run</h2>
          { dungeonDivs }
        </div>


      </div>


    </>
  )
}

export default App
