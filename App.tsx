
import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { AssetViewer } from './components/AssetViewer';
import { DnaInjection } from './components/DnaInjection';
import { NeuralBridge } from './components/NeuralBridge';
import { Sequencer } from './components/Sequencer';
import { MainPreview } from './components/MainPreview';
import { ArchiveGrid } from './components/ArchiveGrid';
import { DnaArchive } from './components/DnaArchive';
import { StatusLogs } from './components/StatusLogs';
import { ErrorModal, LoadingModal } from './components/Modals';

// Centralized Services
import * as GeminiService from './services/gemini';
import { fetchApeMetadata, imageToBase64 } from './services/ipfs';
import { getAllAssets, saveAsset, removeAsset } from './services/storage';

import { GeneratedAsset, SceneOption, AssetType, RenderQuality, ApeMetadata, GroundingSource } from './types';

const getAiStudio = () => (window as any).aistudio;

const App: React.FC = () => {
  // Persistence & Global State
  const [generations, setGenerations] = useState<GeneratedAsset[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [hasApiKey, setHasApiKey] = useState(false);
  const [systemLogs, setSystemLogs] = useState<string[]>(["Studio Core: Online.", "Magma Ape DNA: Stable."]);

  // UI Navigation
  const [viewAsset, setViewAsset] = useState<GeneratedAsset | null>(null);
  const [selectedScene, setSelectedScene] = useState<SceneOption>(SceneOption.THRONE);
  const [customPrompt, setCustomPrompt] = useState("");
  const [aspectRatio, setAspectRatio] = useState<"1:1" | "4:3" | "16:9" | "9:16">("1:1");
  const [assetType, setAssetType] = useState<AssetType>(AssetType.IMAGE);
  const [renderQuality, setRenderQuality] = useState<RenderQuality>('1K');
  const [variationCount, setVariationCount] = useState<1 | 4 | 8>(1);

  // Asset Metadata Features
  const [apeId, setApeId] = useState("");
  const [isFetchingMetadata, setIsFetchingMetadata] = useState(false);
  const [activeMetadata, setActiveMetadata] = useState<ApeMetadata | null>(null);
  const [integrityScore, setIntegrityScore] = useState(100);
  const [referenceImages, setReferenceImages] = useState<string[]>([]);

  // Lore & Evolution
  const [isGeneratingLore, setIsGeneratingLore] = useState(false);
  const [characterLore, setCharacterLore] = useState<string | null>(null);
  const [isEvolving, setIsEvolving] = useState(false);
  const [isLiveActive, setIsLiveActive] = useState(false);
  const [isLiveConnecting, setIsLiveConnecting] = useState(false);
  const [audioStream, setAudioStream] = useState<Float32Array | null>(null);
  const liveSessionRef = useRef<any>(null);

  // Load Initial Data
  useEffect(() => {
    async function init() {
      const assets = await getAllAssets();
      setGenerations(assets);
      const aistudio = getAiStudio();
      if (aistudio?.hasSelectedApiKey) {
        const keyStatus = await aistudio.hasSelectedApiKey();
        setHasApiKey(!!keyStatus);
      }
    }
    init();
  }, []);

  // Keyboard Accessibility
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (viewAsset) { setViewAsset(null); setCharacterLore(null); }
        else if (error) { setError(null); }
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [viewAsset, error]);

  // Update Genomic Integrity Score
  useEffect(() => {
    let score = 100;
    if (referenceImages.length > 5) score -= (referenceImages.length - 5) * 5;
    if (activeMetadata) score += 10;
    if (customPrompt.length > 200) score -= 15;
    setIntegrityScore(Math.min(100, Math.max(0, score)));
  }, [referenceImages, activeMetadata, customPrompt]);

  const addLog = (msg: string) => {
    setSystemLogs(prev => [...prev.slice(-4), `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  const handleKeySelection = async () => {
    const aistudio = getAiStudio();
    if (aistudio?.openSelectKey) {
      addLog("CORE: Requesting Paid API Key selection...");
      await aistudio.openSelectKey();
      setHasApiKey(true);
    }
  };

  const handleFetchDNA = async () => {
    if (!apeId) return;
    setIsFetchingMetadata(true);
    addLog(`IPFS: Scanning DNA for Ape #${apeId}...`);
    try {
      const metadata = await fetchApeMetadata(apeId);
      setActiveMetadata(metadata);
      addLog(`SUCCESS: ${metadata.name} verified.`);
      const base64 = await imageToBase64(metadata.image);
      setReferenceImages(prev => [base64, ...prev.slice(0, 39)]);
      addLog("LINK: Reference DNA injected.");
    } catch (err: any) {
      addLog(`ERROR: IPFS Link Failure.`);
      setError(err.message);
    } finally {
      setIsFetchingMetadata(false);
    }
  };

  const handleGenerate = async (startImage?: string) => {
    const needsKey = renderQuality !== '1K' || assetType === AssetType.VIDEO || selectedScene === SceneOption.TECHNICAL;
    if (needsKey && !hasApiKey) {
      await handleKeySelection();
      return;
    }

    setError(null);
    setIsLoading(true);
    const count = startImage ? 1 : variationCount;
    
    let traitContext = "";
    if (activeMetadata) {
      const traits = activeMetadata.attributes.map(a => `${a.trait_type}: ${a.value}`).join(", ");
      traitContext = `Mandatory DNA Traits: ${traits}. `;
    }

    addLog(`INITIATING: ${count}x sequence batch.`);
    
    try {
      const newAssets: GeneratedAsset[] = [];
      for (let i = 0; i < count; i++) {
        setStatusMessage(`Synthesizing DNA unit [${i + 1}/${count}]...`);
        const finalPrompt = traitContext + customPrompt;
        
        let url: string;
        let sources: GroundingSource[] | undefined;

        if (assetType === AssetType.VIDEO || startImage) {
          url = await GeminiService.generateMagmaApeVideo(selectedScene, finalPrompt, "16:9", referenceImages, startImage);
        } else {
          const res = await GeminiService.generateMagmaApeImage(selectedScene, finalPrompt, aspectRatio, referenceImages, renderQuality);
          url = res.url;
          sources = res.sources;
        }

        const newAsset: GeneratedAsset = {
          id: `${Date.now()}-${i}`,
          url,
          type: (assetType === AssetType.VIDEO || startImage) ? AssetType.VIDEO : AssetType.IMAGE,
          prompt: finalPrompt || selectedScene,
          timestamp: Date.now(),
          quality: renderQuality,
          sources: sources
        };

        await saveAsset(newAsset);
        newAssets.push(newAsset);
        addLog(`SYNC: Unit ${i + 1} archived.`);
      }

      setGenerations(prev => [...newAssets, ...prev]);
      addLog(`BATCH: All units stable.`);
    } catch (err: any) {
      const errorMsg = typeof err === 'string' ? err : (err.message || JSON.stringify(err));
      addLog(`FATAL: ${errorMsg.slice(0, 60)}...`);
      setError(errorMsg);
      if (errorMsg.includes("Requested entity was not found")) setHasApiKey(false);
    } finally {
      setIsLoading(false);
      setStatusMessage("");
    }
  };

  const handleEvolve = async (prompt: string) => {
    if (!viewAsset || !prompt) return;
    setIsEvolving(true);
    addLog("MUTATION: Initiating genetic override...");
    try {
      const evolvedUrl = await GeminiService.evolveMagmaApeAsset(viewAsset.url, prompt, renderQuality);
      const newAsset: GeneratedAsset = {
        id: `${Date.now()}-evolve`,
        url: evolvedUrl,
        type: AssetType.IMAGE,
        prompt: `Evolution: ${prompt} | Base: ${viewAsset.prompt}`,
        timestamp: Date.now(),
        quality: renderQuality,
      };
      await saveAsset(newAsset);
      setGenerations(prev => [newAsset, ...prev]);
      setViewAsset(newAsset);
      addLog("SUCCESS: Mutation stable.");
    } catch (e: any) {
      const msg = e.message || "Mutation rejected.";
      addLog(`ERROR: ${msg}`);
      setError(msg);
    } finally {
      setIsEvolving(false);
    }
  };

  const handleDecodeLore = async () => {
    if (!viewAsset) return;
    setIsGeneratingLore(true);
    addLog("LORE: Reconstructing character history...");
    try {
      const lore = await GeminiService.generateMagmaApeLore(viewAsset.prompt);
      setCharacterLore(lore);
      addLog("SUCCESS: Biography decoded.");
    } catch (e) {
      addLog("ERROR: Data record corrupted.");
    } finally {
      setIsGeneratingLore(false);
    }
  };

  const handleDeleteAsset = async (id: string) => {
    addLog("ARCHIVE: Purging record...");
    try {
      await removeAsset(id);
      setGenerations(prev => prev.filter(g => g.id !== id));
      addLog("SUCCESS: Record deleted.");
    } catch (e) { addLog("ERROR: Deletion failed."); }
  };

  const toggleLiveLink = async () => {
    if (isLiveActive) {
      liveSessionRef.current?.close();
      liveSessionRef.current = null;
      setIsLiveActive(false);
      return;
    }

    setIsLiveConnecting(true);
    addLog("NEURAL: Attempting uplink...");
    try {
      liveSessionRef.current = await GeminiService.connectMagmaLive({
        onAudioData: (buffer) => setAudioStream(buffer.getChannelData(0)),
        onInterrupted: () => addLog("NEURAL: Stream Interrupted."),
        onLog: (msg) => addLog(msg)
      });
      setIsLiveActive(true);
    } catch (e) { setError("Uplink failed."); }
    finally { setIsLiveConnecting(false); }
  };

  const handleInjectFiles = (files: FileList) => {
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setReferenceImages(prev => [reader.result as string, ...prev.slice(0, 39)]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#050505]">
      <Header />
      
      <main className="flex-grow max-w-7xl mx-auto w-full p-4 md:p-8 space-y-12 relative z-20">
        {error && <ErrorModal error={error} onClose={() => setError(null)} />}
        {isLoading && <LoadingModal message={statusMessage} />}

        {viewAsset && (
          <AssetViewer 
            asset={viewAsset}
            onClose={() => { setViewAsset(null); setCharacterLore(null); }}
            onEvolve={handleEvolve}
            onDelete={handleDeleteAsset}
            onDecodeLore={handleDecodeLore}
            isEvolving={isEvolving}
            isGeneratingLore={isGeneratingLore}
            characterLore={characterLore}
          />
        )}

        <DnaInjection 
          apeId={apeId} 
          setApeId={setApeId} 
          onFetch={handleFetchDNA} 
          isFetching={isFetchingMetadata}
          metadata={activeMetadata}
          integrityScore={integrityScore}
        />

        <NeuralBridge 
          isActive={isLiveActive}
          isConnecting={isLiveConnecting}
          onToggle={toggleLiveLink}
          audioStream={audioStream}
          hasApiKey={hasApiKey}
          onKeySelection={handleKeySelection}
        />

        <section className="grid lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-4 space-y-8">
            <Sequencer 
              assetType={assetType}
              setAssetType={setAssetType}
              variationCount={variationCount}
              setVariationCount={setVariationCount}
              selectedScene={selectedScene}
              setSelectedScene={setSelectedScene}
              customPrompt={customPrompt}
              setCustomPrompt={setCustomPrompt}
              renderQuality={renderQuality}
              setRenderQuality={setRenderQuality}
              aspectRatio={aspectRatio}
              setAspectRatio={setAspectRatio}
              onGenerate={() => handleGenerate()}
              isLoading={isLoading}
            />
            <StatusLogs logs={systemLogs} />
          </div>

          <div className="lg:col-span-8 space-y-8">
            <DnaArchive 
              images={referenceImages}
              onInject={handleInjectFiles}
              onRemove={(idx) => setReferenceImages(prev => prev.filter((_, i) => i !== idx))}
              onClear={() => setReferenceImages([])}
            />
            <MainPreview 
              latestAsset={generations[0] || null}
              onView={setViewAsset}
              onAnimate={(url) => handleGenerate(url)}
            />
          </div>
        </section>

        <ArchiveGrid 
          assets={generations} 
          onView={setViewAsset} 
          onDelete={handleDeleteAsset} 
        />
      </main>

      <Footer integrityScore={integrityScore} />
    </div>
  );
};

export default App;
