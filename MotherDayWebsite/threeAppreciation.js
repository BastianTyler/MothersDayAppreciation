// Set up Three.js scene
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)
const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.getElementById('container3D').appendChild(renderer.domElement)

// Create text geometry
const loader = new THREE.FontLoader()
loader.load(
  'https://threejs.org/examples/fonts/helvetiker_regular.typeface.json',
  function (font) {
    const geometry = new THREE.TextGeometry('I appreciate you because _____', {
      font: font,
      size: 40,
      height: 5,
      curveSegments: 12,
      bevelEnabled: true,
      bevelThickness: 2,
      bevelSize: 1,
      bevelSegments: 5,
    })
    const material = new THREE.MeshBasicMaterial({ color: 0xff00ff })
    const textMesh = new THREE.Mesh(geometry, material)
    scene.add(textMesh)

    // Set initial camera position
    camera.position.z = 100

    // Set up mouse hover effect
    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2()

    function onMouseMove(event) {
      // Calculate mouse position in normalized device coordinates
      // (-1 to +1) for both components
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

      // Update the picking ray with the camera and mouse position
      raycaster.setFromCamera(mouse, camera)

      // Check if the ray intersects with the text mesh
      const intersects = raycaster.intersectObject(textMesh)

      if (intersects.length > 0) {
        // Apply smoke effect
        textMesh.material.uniforms.fade.value = 1.0
      } else {
        // Reset smoke effect
        textMesh.material.uniforms.fade.value = 0.0
      }
    }

    document.addEventListener('mousemove', onMouseMove, false)

    // Add custom shader material for smoke effect
    const smokeMaterial = new THREE.ShaderMaterial({
      uniforms: {
        fade: { value: 0.0 },
      },
      vertexShader: document.getElementById('vertexShader').textContent,
      fragmentShader: document.getElementById('fragmentShader').textContent,
    })

    textMesh.material = smokeMaterial

    // Animate the scene
    function animate() {
      requestAnimationFrame(animate)
      renderer.render(scene, camera)
    }
    animate()
  }
)
