import React, { useState, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { MOLECULE_PRESETS, ATOM_BOHR_PRESETS } from '../../data/mockCurriculum';
import { ELEMENT_PROPERTIES } from '../../utils/mathPhysics';
import { CapturedMedia } from '../../types';
import { Camera, Video, Check, Square } from 'lucide-react';

interface Chemistry3DStudioProps {
  initialMoleculeId?: string;
  onSaveMedia?: (media: CapturedMedia) => void;
}

export const Chemistry3DStudio: React.FC<Chemistry3DStudioProps> = ({
  initialMoleculeId = 'h2o',
  onSaveMedia,
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);

  const [activeTab, setActiveTab] = useState<'molecule' | 'bohr'>('molecule');
  const [selectedMoleculeId, setSelectedMoleculeId] = useState(initialMoleculeId);
  const [selectedBohrSymbol, setSelectedBohrSymbol] = useState('C');
  const [renderMode, setRenderMode] = useState<'ball-and-stick' | 'space-filling'>('ball-and-stick');
  const [autoRotate, setAutoRotate] = useState(true);
  const autoRotateRef = useRef(autoRotate);
  autoRotateRef.current = autoRotate;

  const [isRecording, setIsRecording] = useState(false);
  const [recordProgress, setRecordProgress] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const modelGroupRef = useRef<THREE.Group | null>(null);
  const bohrElectronsRef = useRef<Array<{ mesh: THREE.Mesh; radius: number; angle: number; speed: number }>>([]);

  const currentMolecule = MOLECULE_PRESETS.find(m => m.id === selectedMoleculeId) || MOLECULE_PRESETS[0];
  const currentBohr = ATOM_BOHR_PRESETS.find(b => b.symbol === selectedBohrSymbol) || ATOM_BOHR_PRESETS[2];

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    const scene = new THREE.Scene();
    sceneRef.current = scene;
    // Bright studio daylight background (#f1f5f9)
    scene.background = new THREE.Color(0xf1f5f9);

    const width = container.clientWidth || 760;
    const height = container.clientHeight || 460;

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0.6, 4.2);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    rendererRef.current = renderer;

    container.replaceChildren(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.05;
    controls.minDistance = 1.5;
    controls.maxDistance = 12;
    controls.target.set(0, 0, 0);
    controls.update();
    controlsRef.current = controls;

    try {
      const pmremGenerator = new THREE.PMREMGenerator(renderer);
      scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
      pmremGenerator.dispose();
    } catch {
      // Fallback
    }

    // Balanced Studio Lighting Rig (Warm Key + Cool Hemisphere Fill)
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0xcbd5e1, 1.1);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfffbeb, 1.8);
    keyLight.position.set(4, 6, 5);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xe0f2fe, 1.0);
    fillLight.position.set(-5, -2, 3);
    scene.add(fillLight);

    const modelGroup = new THREE.Group();
    scene.add(modelGroup);
    modelGroupRef.current = modelGroup;

    let frameId = 0;
    let isDisposed = false;

    function afterDraw(cb: () => void) {
      if (isDisposed) return;
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        if (isDisposed) return;
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    const tick = () => {
      if (isDisposed) return;

      if (autoRotateRef.current && modelGroupRef.current) {
        modelGroupRef.current.rotation.y += isSoftwareGl ? 0.03 : 0.008;
      }

      if (bohrElectronsRef.current.length > 0) {
        for (const e of bohrElectronsRef.current) {
          e.angle += isSoftwareGl ? e.speed * 3 : e.speed;
          e.mesh.position.x = Math.cos(e.angle) * e.radius;
          e.mesh.position.z = Math.sin(e.angle) * e.radius;
        }
      }

      controls.update();
      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    };

    tick();

    const handleResize = () => {
      if (!container || !renderer) return;
      const newW = container.clientWidth || 760;
      const newH = container.clientHeight || 460;
      if (newW > 0 && newH > 0) {
        camera.aspect = newW / newH;
        camera.updateProjectionMatrix();
        renderer.setSize(newW, newH);
        renderer.render(scene, camera);
      }
    };

    const resizeObserver = new ResizeObserver(() => handleResize());
    resizeObserver.observe(container);
    window.addEventListener('resize', handleResize);

    return () => {
      isDisposed = true;
      resizeObserver.disconnect();
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      controls.dispose();
      renderer.dispose();
    };
  }, []);

  useEffect(() => {
    const modelGroup = modelGroupRef.current;
    if (!modelGroup) return;

    while (modelGroup.children.length > 0) {
      const obj = modelGroup.children[0];
      modelGroup.remove(obj);
      if (obj instanceof THREE.Mesh) {
        obj.geometry.dispose();
        if (Array.isArray(obj.material)) {
          obj.material.forEach(m => m.dispose());
        } else {
          obj.material.dispose();
        }
      }
    }

    bohrElectronsRef.current = [];

    if (activeTab === 'molecule') {
      const mol = currentMolecule;
      const isSpaceFilling = renderMode === 'space-filling';

      mol.atoms.forEach(atom => {
        const prop = ELEMENT_PROPERTIES[atom.element] || { color: '#64748b', radius: 0.4 };
        const radius = isSpaceFilling ? prop.radius * 1.65 : prop.radius * 1.15;

        // Crisp high-contrast CPK shading on light background
        const atomColor = atom.element === 'H' ? '#ffffff' : prop.color;

        const sphereGeo = new THREE.SphereGeometry(radius, 32, 32);
        const sphereMat = new THREE.MeshStandardMaterial({
          color: new THREE.Color(atomColor),
          roughness: 0.25,
          metalness: 0.1,
        });

        const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
        sphereMesh.position.set(...atom.position);
        modelGroup.add(sphereMesh);
      });

      if (!isSpaceFilling) {
        mol.bonds.forEach(bond => {
          const atom1 = mol.atoms[bond.from];
          const atom2 = mol.atoms[bond.to];
          if (!atom1 || !atom2) return;

          const p1 = new THREE.Vector3(...atom1.position);
          const p2 = new THREE.Vector3(...atom2.position);
          const distance = p1.distanceTo(p2);
          const midPoint = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);

          const bondOrders = bond.order === 2 ? [-0.08, 0.08] : [0];

          bondOrders.forEach(offset => {
            const cylinderGeo = new THREE.CylinderGeometry(0.075, 0.075, distance, 16);
            const cylinderMat = new THREE.MeshStandardMaterial({
              color: 0x475569,
              roughness: 0.35,
              metalness: 0.2,
            });

            const cylinderMesh = new THREE.Mesh(cylinderGeo, cylinderMat);
            cylinderMesh.position.copy(midPoint);

            const orientation = new THREE.Matrix4();
            const up = new THREE.Vector3(0, 1, 0);
            orientation.lookAt(p1, p2, up);
            cylinderMesh.quaternion.setFromRotationMatrix(orientation);
            cylinderMesh.rotateX(Math.PI / 2);

            if (offset !== 0) {
              cylinderMesh.position.x += offset;
            }

            modelGroup.add(cylinderMesh);
          });
        });
      }
    } else {
      const bohr = currentBohr;

      const nucleusGroup = new THREE.Group();
      const numNucleons = Math.min(16, bohr.Z * 2);
      for (let i = 0; i < numNucleons; i++) {
        const isProton = i % 2 === 0;
        const sphereGeo = new THREE.SphereGeometry(0.14, 16, 16);
        const sphereMat = new THREE.MeshStandardMaterial({
          color: isProton ? 0xdc2626 : 0x2563eb,
          roughness: 0.25,
        });
        const nMesh = new THREE.Mesh(sphereGeo, sphereMat);
        nMesh.position.set(
          (Math.random() - 0.5) * 0.3,
          (Math.random() - 0.5) * 0.3,
          (Math.random() - 0.5) * 0.3
        );
        nucleusGroup.add(nMesh);
      }
      modelGroup.add(nucleusGroup);

      bohr.shells.forEach((electronCount, shellIdx) => {
        const orbitRadius = 0.9 + shellIdx * 0.75;

        const ringGeo = new THREE.RingGeometry(orbitRadius - 0.02, orbitRadius + 0.02, 64);
        const ringMat = new THREE.MeshBasicMaterial({
          color: 0x475569,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.55,
        });
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        ringMesh.rotation.x = Math.PI / 2 + shellIdx * 0.2;
        modelGroup.add(ringMesh);

        for (let e = 0; e < electronCount; e++) {
          const angle = (e / electronCount) * Math.PI * 2;
          const eGeo = new THREE.SphereGeometry(0.085, 16, 16);
          const eMat = new THREE.MeshStandardMaterial({
            color: 0x0284c7,
            roughness: 0.2,
          });
          const eMesh = new THREE.Mesh(eGeo, eMat);

          eMesh.position.set(Math.cos(angle) * orbitRadius, 0, Math.sin(angle) * orbitRadius);

          modelGroup.add(eMesh);
          bohrElectronsRef.current.push({
            mesh: eMesh,
            radius: orbitRadius,
            angle,
            speed: 0.025 / (shellIdx + 1),
          });
        }
      });
    }

    if (rendererRef.current && sceneRef.current && cameraRef.current) {
      rendererRef.current.render(sceneRef.current, cameraRef.current);
    }
  }, [activeTab, selectedMoleculeId, selectedBohrSymbol, renderMode, currentMolecule, currentBohr]);

  const handleExportSnapshot = () => {
    const renderer = rendererRef.current;
    const scene = sceneRef.current;
    if (!renderer || !scene) return;

    if (controlsRef.current) {
      controlsRef.current.update();
      renderer.render(scene, controlsRef.current.object as THREE.Camera);
    }

    const dataUrl = renderer.domElement.toDataURL('image/png');

    const link = document.createElement('a');
    link.download = `MoHinh3D_Hoa_${activeTab === 'molecule' ? currentMolecule.id : currentBohr.symbol}.png`;
    link.href = dataUrl;
    link.click();

    if (onSaveMedia) {
      onSaveMedia({
        id: `img-chem-${Date.now()}`,
        type: 'image',
        title: `Mô hình 3D: ${activeTab === 'molecule' ? currentMolecule.nameVi : `Nguyên tử ${currentBohr.nameVi}`}`,
        subjectId: 'hoa',
        gradeId: currentMolecule.grade,
        dataUrl,
        format: 'PNG',
        createdAt: new Date().toLocaleString('vi-VN'),
        notes: `Chế độ: ${renderMode === 'ball-and-stick' ? 'Quả cầu & que' : 'Phủ không gian CPK'}`,
      });
    }

    showToast('Đã chụp và lưu ảnh mô hình 3D thành công!');
  };

  const handleRecordVideo = async () => {
    const renderer = rendererRef.current;
    if (!renderer || isRecording) return;

    try {
      setIsRecording(true);
      setRecordProgress(0);
      recordedChunksRef.current = [];

      const stream = renderer.domElement.captureStream(30);
      const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
        ? 'video/webm;codecs=vp9'
        : 'video/webm';

      const recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 3000000 });
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = e => {
        if (e.data && e.data.size > 0) {
          recordedChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        const videoUrl = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = videoUrl;
        a.download = `Video_3D_360_${activeTab === 'molecule' ? currentMolecule.id : currentBohr.symbol}.webm`;
        a.click();

        if (onSaveMedia) {
          onSaveMedia({
            id: `vid-chem-${Date.now()}`,
            type: 'video',
            title: `Video 3D 360°: ${activeTab === 'molecule' ? currentMolecule.nameVi : currentBohr.nameVi}`,
            subjectId: 'hoa',
            gradeId: currentMolecule.grade,
            dataUrl: videoUrl,
            format: 'WEBM',
            createdAt: new Date().toLocaleString('vi-VN'),
            notes: 'Mô hình 3D xoay 360 độ phục vụ giảng dạy môn Hóa.',
          });
        }

        setIsRecording(false);
        showToast('Đã quay và lưu video xoay 360° thành công!');
      };

      recorder.start();

      const durationMs = 5000;
      const startRotY = modelGroupRef.current ? modelGroupRef.current.rotation.y : 0;
      const startTime = performance.now();

      const animateRecord = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(1, elapsed / durationMs);

        setRecordProgress(Math.round(progress * 100));

        if (modelGroupRef.current) {
          modelGroupRef.current.rotation.y = startRotY + progress * Math.PI * 2;
        }

        if (progress < 1) {
          requestAnimationFrame(animateRecord);
        } else {
          setTimeout(() => {
            if (recorder.state !== 'inactive') {
              recorder.stop();
            }
          }, 400);
        }
      };

      requestAnimationFrame(animateRecord);
    } catch {
      setIsRecording(false);
      showToast('Trình duyệt không hỗ trợ quay video WebGL.');
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 text-slate-900 overflow-hidden">
      {/* Studio Header Bar */}
      <div className="bg-white border-b border-slate-200 px-6 py-3.5 flex flex-wrap items-center justify-between gap-4 shrink-0">
        <div>
          <h2 className="font-bold text-slate-900 text-lg tracking-tight">
            Studio Mô Hình Phân Tử & Nguyên Tử 3D
          </h2>
          <p className="text-xs text-slate-500">
            Quan sát cấu trúc không gian VSEPR, lớp vỏ electron Bohr và xuất hình ảnh / video 360°
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleExportSnapshot}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold border border-slate-200 shadow-2xs transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Camera className="w-4 h-4 text-blue-600" />
            <span>Chụp ảnh 3D</span>
          </button>

          <button
            type="button"
            onClick={handleRecordVideo}
            disabled={isRecording}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-colors shadow-xs whitespace-nowrap shrink-0 cursor-pointer ${
              isRecording
                ? 'bg-rose-600 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {isRecording ? (
              <>
                <Square className="w-3.5 h-3.5 fill-current" />
                <span>Đang quay 360° ({recordProgress}%)</span>
              </>
            ) : (
              <>
                <Video className="w-4 h-4" />
                <span>Quay video 360° (5s)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Two-Zone Sandbox Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 overflow-y-auto lg:overflow-hidden">
        {/* Left Zone: 3D Stage */}
        <div className="lg:col-span-8 flex flex-col bg-white border border-slate-200 rounded-2xl shadow-2xs overflow-hidden relative min-h-[440px]">
          <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setActiveTab('molecule')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  activeTab === 'molecule'
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                Mô hình Phân tử 3D
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('bohr')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  activeTab === 'bohr'
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                Cấu trúc Nguyên tử Bohr 3D
              </button>
            </div>

            <label className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={autoRotate}
                onChange={e => setAutoRotate(e.target.checked)}
                className="rounded accent-blue-600"
              />
              <span>Tự động xoay</span>
            </label>
          </div>

          <div className="flex-1 relative bg-slate-100 min-h-[420px]">
            <div ref={mountRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" />
          </div>

          <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
            <span>Nhấp chuột và kéo để xoay 360° · Cuộn con lăn chuột để thu phóng</span>
            <span className="font-semibold text-slate-700">
              {activeTab === 'molecule' ? currentMolecule.nameVi : `Nguyên tử ${currentBohr.nameVi} (Z = ${currentBohr.Z})`}
            </span>
          </div>

          {toastMessage && (
            <div className="absolute bottom-14 right-6 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 text-xs font-semibold">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>{toastMessage}</span>
            </div>
          )}
        </div>

        {/* Right Zone: Control & Concept Deck */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs flex flex-col gap-5 overflow-y-auto">
          {activeTab === 'molecule' ? (
            <>
              <div>
                <h3 className="text-xs font-bold text-slate-700 mb-2">
                  Chọn phân tử hóa học (Lớp 8 – 12)
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {MOLECULE_PRESETS.map(mol => {
                    const isSelected = selectedMoleculeId === mol.id;
                    return (
                      <button
                        key={mol.id}
                        type="button"
                        onClick={() => setSelectedMoleculeId(mol.id)}
                        className={`p-2.5 rounded-xl text-left transition-colors border cursor-pointer ${
                          isSelected
                            ? 'bg-blue-50 border-blue-600 text-blue-950 font-semibold'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <div className="text-sm font-bold font-mono">{mol.formula}</div>
                        <div className="text-xs text-slate-500 truncate">{mol.name}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold text-slate-700 mb-2">
                  Kiểu biểu diễn không gian
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRenderMode('ball-and-stick')}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                      renderMode === 'ball-and-stick'
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Quả cầu & que nối
                  </button>
                  <button
                    type="button"
                    onClick={() => setRenderMode('space-filling')}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                      renderMode === 'space-filling'
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Đặc khít (CPK)
                  </button>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <div className="text-xs text-slate-500 font-medium">
                  Lớp {currentMolecule.grade} · {currentMolecule.category} · {currentMolecule.geometry}
                </div>
                <h4 className="font-bold text-slate-900 text-sm">
                  {currentMolecule.nameVi}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {currentMolecule.description}
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h4 className="text-xs font-bold text-slate-800 mb-2.5">
                  Bảng màu nguyên tố chuẩn CPK
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-700">
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-slate-200 border border-slate-400 shrink-0" />
                    <span>H (Hiđro)</span>
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-neutral-800 shrink-0" />
                    <span>C (Cacbon)</span>
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-600 shrink-0" />
                    <span>O (Oxi)</span>
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-blue-600 shrink-0" />
                    <span>N (Nitơ)</span>
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-green-500 shrink-0" />
                    <span>Cl (Clo)</span>
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-purple-600 shrink-0" />
                    <span>Na (Natri)</span>
                  </span>
                </div>
              </div>
            </>
          ) : (
            <>
              <div>
                <h3 className="text-xs font-bold text-slate-700 mb-2">
                  Chọn nguyên tố hóa học
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {ATOM_BOHR_PRESETS.map(atom => (
                    <button
                      key={atom.symbol}
                      type="button"
                      onClick={() => setSelectedBohrSymbol(atom.symbol)}
                      className={`p-2.5 rounded-xl text-center border transition-colors cursor-pointer ${
                        selectedBohrSymbol === atom.symbol
                          ? 'bg-blue-50 border-blue-600 text-blue-950 font-bold'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <div className="text-sm font-mono font-bold">{atom.symbol}</div>
                      <div className="text-xs text-slate-500 font-mono">Z = {atom.Z}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2.5">
                <div className="text-xs text-slate-500 font-medium">
                  Số hiệu nguyên tử Z = {currentBohr.Z}
                </div>
                <h4 className="font-bold text-slate-900 text-base">
                  Nguyên tử {currentBohr.nameVi} ({currentBohr.symbol})
                </h4>
                <div className="text-xs text-slate-700 space-y-1">
                  <span className="font-semibold block">Cấu hình phân lớp vỏ electron:</span>
                  <div className="flex flex-wrap gap-2 pt-1 font-mono tabular-nums">
                    {currentBohr.shells.map((count, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-blue-800 font-semibold text-xs"
                      >
                        Lớp {String.fromCharCode(75 + idx)}: {count}e
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed pt-1">
                  {currentBohr.description}
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
