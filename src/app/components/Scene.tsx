import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, Stars, Sparkles, PerspectiveCamera, Environment } from '@react-three/drei'
import * as THREE from 'three'
import React from 'react'

// Wrap intrinsic elements to bypass Figma inspector DOM event injection
const Mesh = React.forwardRef<any, any>((props, ref) => React.createElement('mesh', { ...props, ref }))
const Group = React.forwardRef<any, any>((props, ref) => React.createElement('group', { ...props, ref }))
const AmbientLight = (props: any) => React.createElement('ambientLight', props)
const DirectionalLight = (props: any) => React.createElement('directionalLight', props)
const SpotLight = (props: any) => React.createElement('spotLight', props)
const TorusGeometry = (props: any) => React.createElement('torusGeometry', props)
const MeshStandardMaterial = (props: any) => React.createElement('meshStandardMaterial', props)
const RingGeometry = (props: any) => React.createElement('ringGeometry', props)
const TorusKnotGeometry = (props: any) => React.createElement('torusKnotGeometry', props)
const IcosahedronGeometry = (props: any) => React.createElement('icosahedronGeometry', props)
const OctahedronGeometry = (props: any) => React.createElement('octahedronGeometry', props)
const SphereGeometry = (props: any) => React.createElement('sphereGeometry', props)

export function Scene() {
  const groupRef = useRef<THREE.Group>(null)
  const torusRef = useRef<THREE.Mesh>(null)
  const ringRef = useRef<THREE.Mesh>(null)

  // Track scroll position manually
  const scrollY = useRef(0)

  useEffect(() => {
    const scrollRoot = () => document.getElementById('portfolio-scroll')

    const handleScroll = () => {
      const el = scrollRoot()
      if (el) {
        const maxScroll = el.scrollHeight - el.clientHeight
        if (maxScroll > 0) scrollY.current = el.scrollTop / maxScroll
        return
      }
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      if (maxScroll > 0) scrollY.current = window.scrollY / maxScroll
    }

    const el = scrollRoot()
    const target: HTMLElement | Window = el ?? window
    target.addEventListener('scroll', handleScroll, { passive: true })
    const t = window.setTimeout(handleScroll, 100)
    return () => {
      window.clearTimeout(t)
      target.removeEventListener('scroll', handleScroll)
    }
  }, [])

  useFrame((state, delta) => {
    if (!groupRef.current) return

    // Smooth damp towards the target based on scrollY
    const targetRotY = scrollY.current * Math.PI * 4 // 2 full rotations over full scroll
    const targetRotX = scrollY.current * Math.PI * 2 // 1 full rotation

    // Determine target position based on scroll zones
    let targetPosX = 0
    let targetPosY = 0
    let targetPosZ = 0
    let targetScale = 1

    const scrollPerc = scrollY.current

    // Five scroll bands: Hero, About, Experience, Projects (+ Roles), Contact (Achievements section hidden)
    if (scrollPerc < 0.16) {
      // Hero (0 - 16%)
      targetPosX = 2; targetPosY = -1; targetPosZ = 0;
      targetScale = 1.2;
    } else if (scrollPerc < 0.33) {
      // About (16 - 33%)
      targetPosX = -4; targetPosY = 0; targetPosZ = -3;
      targetScale = 0.8;
    } else if (scrollPerc < 0.5) {
      // Experience (33 - 50%)
      targetPosX = 0; targetPosY = -2; targetPosZ = -4;
      targetScale = 1.0;
    } else if (scrollPerc < 0.83) {
      // Projects / Roles (50 - 83%)
      targetPosX = 4; targetPosY = 2; targetPosZ = -2;
      targetScale = 0.9;
    } else {
      // Contact (83 - 100%)
      targetPosX = 0; targetPosY = 0; targetPosZ = 2;
      targetScale = 1.4;
    }

    // Add mouse parallax
    const mouseX = (state.pointer.x * 2)
    const mouseY = (state.pointer.y * 2)

    // Lerp group rotation
    groupRef.current.rotation.y = THREE.MathUtils.damp(groupRef.current.rotation.y, targetRotY + (mouseX * 0.1), 2, delta)
    groupRef.current.rotation.x = THREE.MathUtils.damp(groupRef.current.rotation.x, targetRotX + (-mouseY * 0.1), 2, delta)

    groupRef.current.position.x = THREE.MathUtils.damp(groupRef.current.position.x, targetPosX + (mouseX * 0.5), 2, delta)
    groupRef.current.position.y = THREE.MathUtils.damp(groupRef.current.position.y, targetPosY + (mouseY * 0.5), 2, delta)
    groupRef.current.position.z = THREE.MathUtils.damp(groupRef.current.position.z, targetPosZ, 2, delta)

    // Safely update scale
    groupRef.current.scale.x = THREE.MathUtils.damp(groupRef.current.scale.x, targetScale, 2, delta)
    groupRef.current.scale.y = THREE.MathUtils.damp(groupRef.current.scale.y, targetScale, 2, delta)
    groupRef.current.scale.z = THREE.MathUtils.damp(groupRef.current.scale.z, targetScale, 2, delta)

    // Animate extra elements based on scroll
    if (torusRef.current) {
      torusRef.current.rotation.z = scrollY.current * Math.PI * 8
      torusRef.current.position.y = THREE.MathUtils.damp(torusRef.current.position.y, -2 + scrollY.current * 10, 2, delta)
    }
    if (ringRef.current) {
      ringRef.current.rotation.x = scrollY.current * Math.PI * 4
      ringRef.current.scale.setScalar(1 + scrollY.current * 2)
    }
  })

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={50} />

      {/* Lights */}
      <AmbientLight intensity={0.5} />
      <DirectionalLight position={[10, 10, 5]} intensity={2} color="#4f46e5" />
      <DirectionalLight position={[-10, -10, -5]} intensity={2} color="#06b6d4" />
      <SpotLight position={[0, 10, 0]} intensity={3} color="#ffffff" penumbra={1} />

      {/* Environment Background */}
      <Environment preset="city" />
      <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
      <Sparkles count={150} scale={20} size={1.5} speed={0.4} opacity={0.4} color="#a5b4fc" />

      {/* Floating background elements responding to scroll */}
      <Float speed={1} floatIntensity={2}>
        <Mesh ref={torusRef} position={[-5, -2, -5]}>
          <TorusGeometry args={[1, 0.05, 16, 100]} />
          <MeshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={0.5} wireframe />
        </Mesh>
      </Float>

      <Float speed={2} floatIntensity={1}>
        <Mesh ref={ringRef} position={[5, 2, -8]}>
          <RingGeometry args={[1.5, 1.6, 32]} />
          <MeshStandardMaterial color="#c084fc" emissive="#c084fc" emissiveIntensity={0.8} side={THREE.DoubleSide} />
        </Mesh>
      </Float>

      {/* 3D Composition Group */}
      <Group ref={groupRef}>
        {/* Central Complex Shape */}
        <Float speed={1.5} rotationIntensity={1.5} floatIntensity={2}>
          <Mesh>
            <TorusKnotGeometry args={[1.5, 0.4, 256, 32]} />
            <MeshStandardMaterial
              color="#ffffff"
              roughness={0.1}
              metalness={0.9}
              wireframe={true}
              emissive="#4f46e5"
              emissiveIntensity={0.1}
            />
          </Mesh>
        </Float>

        {/* Orbiting Elements */}
        <Float speed={2} rotationIntensity={3} floatIntensity={3}>
          <Mesh position={[4, 2, -2]}>
            <IcosahedronGeometry args={[0.6, 0]} />
            <MeshStandardMaterial color="#4f46e5" roughness={0.2} metalness={0.8} />
          </Mesh>
        </Float>

        <Float speed={1.5} rotationIntensity={2} floatIntensity={2}>
          <Mesh position={[-4, -3, -4]}>
            <OctahedronGeometry args={[0.8, 0]} />
            <MeshStandardMaterial color="#06b6d4" roughness={0.2} metalness={0.8} />
          </Mesh>
        </Float>

        <Float speed={2.5} rotationIntensity={4} floatIntensity={4}>
          <Mesh position={[2, -4, 2]}>
            <SphereGeometry args={[0.4, 32, 32]} />
            <MeshStandardMaterial color="#c084fc" roughness={0.1} metalness={1} />
          </Mesh>
        </Float>
      </Group>
    </>
  )
}
