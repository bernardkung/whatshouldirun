import { useState, useEffect, useMemo } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

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
  const [ activeSpec, setActiveSpec ] = useState()
  const [ specOptions, setSpecOptions ] = useState([])
  const [ targetItems, setTargetItems ] = useState([])

  // const equipmentIconLinks = equipmentTypes.map((equipmentType, e=>`Ui-paperdoll-slot-${equipmentType}.webp`))

  const prettifyText = (inStr) => {
    // Split on dash, and capitalize each word
    return inStr.split("_").map((word, w)=>{
      return String(word).charAt(0).toUpperCase() + String(word).slice(1)
    }).join(" ") 
  }

  useEffect(()=>{
    setSpecOptions(
      charClasses.map((charClass, c)=>{
        const classSpecs = charClass['specializations']
        return classSpecs.map(( spec, s ) => { 
          return `${spec}_${charClass['class']}` 
        })
      }).flat()
    )
  }, [])

  useEffect(()=>{
    console.log(activeSpec)
  }, [activeSpec])

  useEffect(()=>{
    console.log(targetItems)
  }, [targetItems])


  const specOptionsDivs = specOptions.map((spec,s)=>{
    return (
      <option value={ spec } key={s} >
        { prettifyText(spec) }
      </option>
    )
  })

  const onChange = (e)=>{
    setActiveSpec(e.target.value)
  }

  const onClick = (e)=>{
    const targetItem = e.target.id
    if (targetItems.includes(targetItem) === false) {
      console.log(`Adding "${targetItem}"`)
      setTargetItems([...targetItems, targetItem])
    } else {
      console.log(`Removing "${targetItem}"`)
      setTargetItems([...targetItems.filter(i => i !== targetItem)])
    }
  }

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


  // App Body
  return (
    <>
      <p>What Should I Run?</p>
      
      <label id="charClassSpinnerLabel">I'm playing a </label>
      <select id="charClassSpinner" onInput={onChange}>
        { specOptionsDivs }
      </select>
      <p>I am looking for</p>
      { equipmentDivs }


    </>
  )
}

export default App
