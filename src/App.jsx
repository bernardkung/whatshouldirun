import { useState, useEffect, useMemo } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import loot from './tww_s2_loot.json'
import specs from './specs.json'

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
  'mainhand',
  'offhand',
]

const charClasses = [
  {
      "class": "shaman",
      "specializations": [
          "restoration",
          "elemental",
          "enhancement"
      ]
  },
  {
      "class": "death_knight",
      "specializations": [
          "blood",
          "frost",
          "unholy"
      ]
  },
  {
      "class": "hunter",
      "specializations": [
          "beast_mastery",
          "marksmanship",
          "survival"
      ]
  },
  {
      "class": "monk",
      "specializations": [
          "windwalker",
          "mistweaver",
          "brewmaster"
      ]
  },
  {
      "class": "priest",
      "specializations": [
          "holy",
          "shadow",
          "discipline"
      ]
  },
  {
      "class": "warlock",
      "specializations": [
          "demonology",
          "destruction",
          "affliction"
      ]
  },
  {
      "class": "warrior",
      "specializations": [
          "arms",
          "fury",
          "protection"
      ]
  },
  {
      "class": "paladin",
      "specializations": [
          "holy",
          "retribution",
          "protection"
      ]
  },
  {
      "class": "evoker",
      "specializations": [
          "augmentation",
          "preservation"
      ]
  },
  {
      "class": "demon_hunter",
      "specializations": [
          "havoc",
          "vengeance"
      ]
  },
  {
      "class": "druid",
      "specializations": [
          "guardian",
          "feral",
          "balance",
          "restoration"
      ]
  },
  {
      "class": "mage",
      "specializations": [
          "arcane",
          "frost",
          "fire"
      ]
  },
  {
      "class": "rogue",
      "specializations": [
          "assassination",
          "outlaw",
          "subtlety"
      ]
  }
]

const dungeonPool = [
  {
    name: 'Cinderbrew Meadery',
    value:'brew',
  },
  {
    name: 'Darkflame Cleft',
    value:'dfc',
  },
  {
    name: 'Priory of the Sacred Flame',
    value:'psf',
  },
  {
    name: 'The Rookery',
    value:'rook',
  },
  {
    name: 'Operation: Floodgate',
    value:'fg',
  },
  {
    name: 'Theater of Pain',
    value:'top',
  },
  {
    name: 'The MOTHERLODE!!',
    value:'ml',
  },
  {
    name: 'Operation: Mechagon - Workshop',
    value:'work',
  },
]

function App() {
  
  //////////////////////////// STATES ////////////////////////////
  const [ activeSpec, setActiveSpec ] = useState()
  const [ specOptions, setSpecOptions ] = useState([])
  const [ targetItems, setTargetItems ] = useState([])

  // const equipmentIconLinks = equipmentTypes.map((equipmentType, e=>`Ui-paperdoll-slot-${equipmentType}.webp`))
  
  
  //////////////////////////// FUNCTIONS ////////////////////////////
  const prettifyText = (inStr) => {
    // Split on dash, and capitalize each word
    return inStr.split("_").map((word, w)=>{
      return String(word).charAt(0).toUpperCase() + String(word).slice(1)
    }).join(" ") 
  }

  // Find the class and spec matching target    
  const findClassSpec = (target)=>{
    const targetClass = target.split(/_(.*)/s)[1]
    const targetSpec  = target.split(/_(.*)/s)[0]

    const matchClass = specs.find((classSpec)=>{
      return classSpec['className'] === targetClass
    })

    const matchSpec = matchClass['specialization'].find((spec)=>{
      return spec['specName'] === targetSpec
    })

    return {
      'className': matchClass['className'],
      'classSpec': `${target}`,
      ...matchSpec
    }
  }

  //////////////////////////// EFFECTS ////////////////////////////
  useEffect(()=>{
    // setSpecOptions(
    //   charClasses.map((charClass, c)=>{
    //     const classSpecs = charClass['specializations']
    //     return classSpecs.map(( spec, s ) => { 
    //       return `${spec}_${charClass['class']}` 
    //     })
    //   }).flat()
    // )
    setSpecOptions(
      specs.map((charClass, c)=>{
        const classSpecs = charClass['specialization']
        return classSpecs.map(( spec, s ) => { 
          return `${spec['specName']}_${charClass['className']}` 
        })
      }).flat()
    )
  }, [])
  
  useEffect(()=>{
    console.log(activeSpec)
    if (activeSpec) {
      const activeId =`${activeSpec['specName']}_${activeSpec['className']}`
      // console.log(activeId)
    }
    
  }, [activeSpec])

  useEffect(()=>{
    console.log(targetItems)
  }, [targetItems])



  //////////////////////////// EVENT HANDLERS ////////////////////////////
  const onChange = (e)=>{
    setActiveSpec(findClassSpec(e.target.value))
  }

  const onClick = (e)=>{
    const targetItem = e.target.id
    if (targetItems.includes(targetItem) === false) {
      setTargetItems([...targetItems, targetItem])
    } else {
      setTargetItems([...targetItems.filter(i => i !== targetItem)])
    }
  }
  
  const onSpecClick = (e)=>{
    // console.log(e.target.id)
    
    setActiveSpec(findClassSpec(e.target.id))
  }

  //////////////////////////// DIVS ////////////////////////////
  const specOptionsDivs = specOptions.map((spec,s)=>{
    return (
      <option value={ spec } key={s} id={spec}>
        { prettifyText(spec) }
      </option>
    )
  })

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
          className={`${targetItems.includes(equipmentType) ? 'equipSlotLabel-active' : 'equipSlotLabel'}`}
        >
          { equipmentType }
        </p>
      </div>
    )
  })

  function getLootPool(dungeon) {
    // Get loot which matches the dungeon, targetItems, mainStat, and role
    
    // if no targetItems selected, show all

    // if no activeSpec selected
  }

  const dungeonDivs = dungeonPool.map((dungeon, d)=>{
    // Determine dungeon loot pool based on spec and items
    // const lootPool = loot.filter((item, i)=>{
    //   return item['dungeon'] === dungeon['value'] 
    //     && targetItems.includes(item['slot'])
    //     && item['role'].includes(activeSpec['role'])
    //     && item['main_stat'].includes(activeSpec['mainStat'])
    //     && item['category']===activeSpec['armor']
    // })
    // console.log(dungeon['value'], activeSpec['role'], targetItems, activeSpec['mainStat'])

    // if (dungeon['value']='brew') {
    //   loot.map((item, i)=>{
    //     console.log("item", item["dungeon"], item["slot"], item["role"], item["main_stat"])
    //     console.log("targ", dungeon['value'], activeSpec['mainStat'], activeSpec['role'], targetItems)
    //   })
    // }

    // console.log(dungeon['name'], lootPool)

    return (
      <div key={`group${d}`} className={'dungeonGroup'}>
        <img
          key={`banner${d}`}
          className={'dungeonGroupBanner'}
          src={`/images/dungeons/${dungeon['value']}.png`}
        >
        </img>
        <p
          key={d}
          className={'dungeonGroupTitle'}
        >
          {dungeon.name}
        </p>
      </div>
    )
  })


  // App Body
  return (
    <>
      <h1><img className={'titleLogo'} src={'./thinking.svg'}/> What Should I Run? </h1>
      
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
