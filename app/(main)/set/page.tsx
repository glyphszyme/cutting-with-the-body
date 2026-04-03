"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface Config {
    px_per_cm_w: number;
    px_per_cm_h: number;
    font_size_ratio: number;
    max_grid_width: number;
    max_grid_height: number;
}

const DEFAULT_CONFIG: Config = {
    px_per_cm_w: 21.20269841,
    px_per_cm_h: 21.32155439,
    font_size_ratio: 0.8,
    max_grid_width: 25,
    max_grid_height: 84,
};

export default function SetPage() {
    const [config, setConfig] = useState<Config>(DEFAULT_CONFIG);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        const fetchConfig = async () => {
            const { data } = await supabase
                .from('config')
                .select('*')
                .eq('id', 1)
                .single();
            if (data) setConfig(data);
        };
        fetchConfig();
    }, []);

    const handleChange = (key: keyof Config, value: number) => {
        setConfig(prev => ({ ...prev, [key]: value }));
        setSaved(false);
    };

    const handleSave = async () => {
        const { error } = await supabase
            .from('config')
            .upsert({ id: 1, ...config, updated_at: new Date().toISOString() }, { onConflict: 'id' });
        if (!error) {
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
        }
    };

    const labelStyle: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        marginBottom: '24px',
    };

    const inputStyle: React.CSSProperties = {
        fontFamily: 'inherit',
        fontSize: 'var(--font-size-large)',
        background: 'none',
        border: '1px solid var(--color-text)',
        color: 'var(--color-text)',
        padding: '8px 12px',
        width: '100%',
        boxSizing: 'border-box',
    };

    return (
        <div className="container">
            <main>
                <div className="step-header">
                    <div className="text">설정</div>
                </div>

                <div className="step-main" style={{ overflowY: 'auto' }}>

                    <div className="text" style={{ marginBottom: '8px' }}>축척</div>

                    <label style={labelStyle}>
                        <span className="text">px/cm 가로</span>
                        <input
                            type="number"
                            step="0.01"
                            style={inputStyle}
                            value={config.px_per_cm_w}
                            onChange={e => handleChange('px_per_cm_w', parseFloat(e.target.value))}
                        />
                    </label>

                    <label style={labelStyle}>
                        <span className="text">px/cm 세로</span>
                        <input
                            type="number"
                            step="0.01"
                            style={inputStyle}
                            value={config.px_per_cm_h}
                            onChange={e => handleChange('px_per_cm_h', parseFloat(e.target.value))}
                        />
                    </label>

                    <div className="text" style={{ marginBottom: '8px', marginTop: '8px' }}>글자 크기</div>

                    <label style={labelStyle}>
                        <span className="text">셀 대비 비율 (0~1) — 현재 {config.font_size_ratio}</span>
                        <input
                            type="range"
                            min="0.1"
                            max="1"
                            step="0.01"
                            style={{ width: '100%' }}
                            value={config.font_size_ratio}
                            onChange={e => handleChange('font_size_ratio', parseFloat(e.target.value))}
                        />
                    </label>

                    <div className="text" style={{ marginBottom: '8px', marginTop: '8px' }}>최대 개수</div>

                    <label style={labelStyle}>
                        <span className="text">가로 최대</span>
                        <input
                            type="number"
                            min="1"
                            max="100"
                            style={inputStyle}
                            value={config.max_grid_width}
                            onChange={e => handleChange('max_grid_width', parseInt(e.target.value))}
                        />
                    </label>

                    <label style={labelStyle}>
                        <span className="text">세로 최대</span>
                        <input
                            type="number"
                            min="1"
                            max="200"
                            style={inputStyle}
                            value={config.max_grid_height}
                            onChange={e => handleChange('max_grid_height', parseInt(e.target.value))}
                        />
                    </label>

                </div>

                <div className="step-footer">
                    <button
                        onClick={handleSave}
                        className="text"
                        style={{
                            background: 'var(--color-text)',
                            color: 'var(--color-bg)',
                            border: 'none',
                            padding: '12px 24px',
                            cursor: 'pointer',
                            fontFamily: 'inherit',
                            fontSize: 'var(--font-size-large)',
                            width: '100%',
                        }}
                    >
                        {saved ? '저장됨' : '저장'}
                    </button>
                </div>
            </main>
        </div>
    );
}
