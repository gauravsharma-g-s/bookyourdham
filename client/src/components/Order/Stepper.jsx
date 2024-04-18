import React from 'react'

function Stepper({ currentStep, numberOfSteps }) {
    const activeColor = (index) => currentStep >= index ? 'bg-red-500' : 'bg-gray-300'
    const isFinalStep = (index) => index === numberOfSteps - 1
    return (
        <div className="flex  flex-col items-center">
            {Array.from({ length: numberOfSteps }).map((_, index) => (
                <React.Fragment key={index}>
                    <div className={`w-6 h-6 rounded-full ${activeColor(index)}`}></div>
                    {isFinalStep(index) ? null : <div className={`w-1 h-[8rem] ${activeColor(index)}`}></div>}
                </React.Fragment>
            ))}
        </div>
    )
}

export default Stepper
