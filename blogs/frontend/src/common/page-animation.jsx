import {AnimatePresence, motion} from "framer-motion"

const Animationwrapper =({children, keyValue, className, initial = {opacity:0}, animate = {opacity:1}, transition={duration:1}})=>{
    return(
        <AnimatePresence>
            <motion.div 
                key={keyValue}
                initial={initial}
                animate={animate}
                transition={transition}
                className={className}
            >
                {children}
            </motion.div>
        </AnimatePresence>
    )
}

export default Animationwrapper;