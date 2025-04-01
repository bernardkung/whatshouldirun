import { useState, useEffect, useMemo } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import loot from './tww_s2_loot.json'
import specs from './specs.json'
// import charClasses from './class_specs.json'
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
  const [ targetItems, setTargetItems ] = useState([])
  const [ activeItemId, setActiveItemId ] = useState()
  const [ tooltipPosition, setTooltipPosition ] = useState({top: 0, left: 0})
  const [ dungeons, setDungeons ] = useState(updateDungeons())
  const [ expandedDungeons, setExpandedDungeons ] = useState([])

  // const equipmentIconLinks = equipmentTypes.map((equipmentType, e=>`Ui-paperdoll-slot-${equipmentType}.webp`))
  
  
  //////////////////////////// FUNCTIONS ////////////////////////////
  function prettifyText(inStr) {
    function capitalize(inStr) {
      return String(inStr).charAt(0).toUpperCase() + String(inStr).slice(1)
    }
    // Split on dash, and capitalize each word
    if (inStr) {
      return inStr
        .split("_").map(word=>capitalize(word)).join(" ")
        .split("-").map(word=>capitalize(word)).join(" ") 
    } else {
      return ''
    }
  }
   
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
      'classColor': matchClass['color'],
      ...matchSpec
    }
  }

  function findItem ( id ) {
    // TBD: id and item['id'] have different types
    return loot.find((item)=>{
      return item['id'] == id
    })
  }

  function listToggle(list, item) {
    if (list.includes(item)) {
      return list.filter(i => i !== item)
    }
    return [...list, item]
  }

  function countTargetItems (dungeon) {
    // Count the number of target items in the loot pool
    return dungeon['lootPool'].filter(item=>item['target']).length
  }

  function updateDungeons() {
    return dungeonPool.map((dungeon, d)=>{
      return {
        'name': dungeon['name'],
        'value': dungeon['value'],
        'lootPool': getLootPool(dungeon)
      }
    }).sort((a, b)=>countTargetItems(b) - countTargetItems(a))
  }

  //////////////////////////// EFFECTS ////////////////////////////

  useEffect(()=>{
    // Update lootpool
    setDungeons(updateDungeons())
  }, [activeSpec, targetItems])
  
  useEffect(()=>{
    console.log(expandedDungeons)
  }, [expandedDungeons])
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
    const rect = e.target.getBoundingClientRect();
    setTooltipPosition({
      top: rect.top + window.scrollY + 40,
      left: rect.right + window.scrollX - 75
    })
    setActiveItemId(e.target.id)
  }

  const onItemLeave = (e)=>{
    setActiveItemId(null)
  }

  const onExpand = (e)=>{
    setExpandedDungeons(listToggle(expandedDungeons, e.target.id))
  }

  const onAllExpand = (e)=>{
    if (expandedDungeons.length > 0) {
      setExpandedDungeons([])
    } else {
      setExpandedDungeons(dungeons.map((dungeon, d)=>dungeon['value']))
    }
  }

  //////////////////////////// DIVS ////////////////////////////
  
  const specTitle = (spec) => {
    const isActiveSpec = activeSpec 
      ? spec === activeSpec['classSpec'] 
        ? true 
        : false
      : false
    const specColor = findClassSpec(spec)['classColor']
    const specStyle = {color: isActiveSpec ? `1px solid ${specColor}` : ''}

    return (
      <h2 style={specStyle}>I am playing {activeSpec ? prettifyText(activeSpec['classSpec']) : ''}</h2>
    )
  }

  const specOptionsImgs = specs.map((charClass,c)=>{
    return (charClass['specialization'].map((spec, s) => {
      const charSpec = `${spec['specName']}-${charClass['className']}`
      const isActiveSpec = activeSpec 
        ? charSpec === activeSpec['classSpec'] 
          ? true 
          : false
        : false
      const specColor = findClassSpec(charSpec)['classColor']
      const specStyle = {border: isActiveSpec ? `1px solid ${specColor}` : ''}

      return (
        <img 
          key={s}
          className={`specIcon ${isActiveSpec ? 'active' : 'inactive'}`}
          style={specStyle}
          src={ `./images/class_icons/${charSpec}.png` } 
          alt={ spec }
          id={ spec }
          onClick={onSpecClick}
        />
      )
    }))
  })

  
  const groupedSpecOptionsImgs = specs.map((charClass,c)=>{

    // Build the spec icons for this class
    const specImgs = charClass['specialization'].map((spec, s) => {
      const charSpec = `${spec['specName']}-${charClass['className']}`
      const isActiveSpec = activeSpec 
        ? charSpec === activeSpec['classSpec'] 
          ? true 
          : false
        : false
      const specColor = findClassSpec(charSpec)['classColor']
      const specStyle = {border: isActiveSpec ? `1px solid ${specColor}` : ''}

      return (
        <img 
          key={s}
          className={`specIcon ${isActiveSpec ? 'active' : 'inactive'}`}
          style={specStyle}
          src={ `./images/class_icons/${charSpec}.png` } 
          alt={ charSpec }
          id={ charSpec }
          onClick={onSpecClick}
        />
      )
    })

    const classTitle = ()=>{
      return (
        <h2 style={{color:charClass['color']}} className='classTitle'>{ prettifyText(charClass['className']) }</h2>
      )
    }
    // Build a group for this class' spec icons
    return (
      <div key={c} className={`classGroup`}>
      { classTitle() }
        <div key={c} className={`specGroup`}>
          { specImgs }
        </div>
      </div>
    ) 
})


  const equipmentDivs = equipmentTypes.map((equipmentType, e)=>{
    return (
      <div key={e} className={'equipSlotGroup'}>
        <img 
          key={`img${e}`} 
          src={`./images/equipment_slots/Ui-paperdoll-slot-${equipmentType}.webp`}
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
        className={`lootTooltip ${!activeItemId ? 'hidden' : ''}`}
        id={activeItemId}
      >          
        { activeItemId ? findItem(activeItemId)['name'] : ''}
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
            || ['accessory', 'trinket'].includes(item['category'])
            || weaponFilter(item)
          )
        )
    }

    // troubleshooting item filter
    // if (dungeon['value'] === 'brew' && activeSpec && targetItems.length > 0) {
    //   loot.filter((item, i)=>dungeonFilter(item)).map((item, i)=>{
    //     console.log(item, dungeonFilter(item), targetItemsFilter(item), specFilter(item))
    //     // console.log(!activeSpec, item['main_stat'].includes(activeSpec['mainStat']), item['role'].includes(activeSpec['role']))
    //   })
    // }

    // Determine all items in the dungeon for the active spec
    const lootPool = loot.filter((item, i)=>{
      return dungeonFilter(item) && specFilter(item)
    }).map((item, i)=>{
      return {...item, 'target': targetItemsFilter(item)}
    })

    return lootPool
  }

  const dungeonDivs = dungeons.map((dungeon, d)=>{
    // Helper variable for determining dungeon visibility state
    const dungeonActive = dungeon['lootPool'].length > 0 ? 'active' : 'inactive'
    const expanded = expandedDungeons.includes(dungeon['value']) ? 'expanded' : ''

    const lootImg = (item, i) => { return (
      <img 
        key={`img${i}`} 
        src={`./images/equipment_slots/Ui-paperdoll-slot-${item['slot']}.webp`}
        alt={item['name']}
        id={item['id']}
        className={`lootIcon ${expanded}`}
        onMouseEnter={onItemEnter}
        onMouseLeave={onItemLeave}
      />
    )}

    const lootCard = (item, i) => { return (
      <div className={`lootCard ${expanded}`}>
        <h4 className={'lootName'}>{ item['name'] }</h4>
        <p className={'lootType'}>{ prettifyText(item['type']) }</p>
      </div>
    )}

    // Build divs for each item in loot pool
    const lootDivs = dungeon['lootPool'].map((item, i)=>{
      if (!item['target']) {
        return null
      }
      return (
        <div key={i} className={'lootItem'}>
          { lootImg(item, i) }
          { expanded ? lootCard(item, i) : null }
        </div>
      )
    })

    console.log(
      dungeon['lootPool'], 
      dungeon['lootPool'].filter(item=>item['target']),
      countTargetItems(dungeon),
    )
    // Build divs for each dungeon
    return (
      <div key={`group${d}`} className={'dungeonGroup'}>

        <div 
          key={`banner${d}`} 
          className={`dungeonBanner`} 
          onClick={onExpand}
        >
          <img
            key={`banner${d}`}
            className={`dungeonBannerImage ${dungeonActive}`}
            src={`./images/dungeons/${dungeon['value']}.png`}
            id={dungeon['value']}
          >
          </img>
          <div
            key={d}
            className={`dungeonBannerTitle ${dungeonActive}`}
            id={dungeon['value']}
          >
            <h3 id={dungeon['value']}>{dungeon.name} ({countTargetItems(dungeon)}/{dungeon['lootPool'].length})</h3>
            <img 
              src={'./angle-down.svg'} 
              className={`caret ${expanded}`} 
              id={dungeon['value']}
            />
          </div>
        </div>

        <div className={`dungeonContent`}>
          <div className={`lootGroup ${expanded}`}>
            {lootDivs}
          </div>
        </div>

      </div>
    )
  })


  // App Body
  return (
    <>
      <h1><img className={'titleLogo'} src={'./thinking.svg'} /> What Should I Run? </h1>
      
      <div className={'specContainer'}>
        <h2>I am playing {activeSpec ? prettifyText(activeSpec['classSpec']) : ''}</h2>
        {/* { specTitle(activeSpec) } */}
        <div className={'specOptions'}>
          {/* { specOptionsImgs} */}
          { groupedSpecOptionsImgs}
        </div>
      </div>

      <div 
        className={`tooltipContainer ${!activeItemId ? 'hidden' : ''}`}
        style={{
          top: tooltipPosition.top, 
          left: tooltipPosition.left}}
      >
        { lootTooltip() }
      </div>

      <div className={'container'}>
        <div className={'equipmentContainer'}>
          <h2>I am looking for</h2>
          { equipmentDivs }
        </div>

        <div className={'dungeonContainer'}>
          <div className={`dungeonContainerBanner`}>
            <h2 className={`dungeonContainerTitle`}>I should run</h2>
            <img src={'./angle-double-down.svg'} className={`doubleCaret ${expandedDungeons.length > 0 ? 'expanded':''}`} onClick={onAllExpand}/>
          </div>
          { dungeonDivs }
        </div>

      </div>
      
      <div className={'footer'}>
        <p>Built by <a href='https://bernardkung.github.io/'>Bernard Kung</a></p>
        <p>Icons are open-source <a href="https://www.iconshock.com/freeicons/collection/primeicons">primeicons</a> from Iconshock</p>
        <p>World of Warcraft-related art sourced from <a href="https://www.wowhead.com/wow/retail">Wowhead</a></p>
      </div>


    </>
  )
}

export default App
