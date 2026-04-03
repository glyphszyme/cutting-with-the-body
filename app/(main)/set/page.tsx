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

const LIMITS = {
    px_per_cm_w:     { min: 0.01, max: 200 },
    px_per_cm_h:     { min: 0.01, max: 200 },
    font_size_ratio: { min: 0.01, max: 1 },
    max_grid_width:  { min: 1,    max: 200 },
    max_grid_height: { min: 1,    max: 500 },
};

type ErrorMap = Partial<Record<keyof Config, string>>;

function validate(config: Config): ErrorMap {
    const errors: ErrorMap = {};
    (Object.keys(LIMITS) as (keyof Config)[]).forEach(key => {
        const val = config[key];
        if (isNaN(val) || val === null || val === undefined) {
            errors[key] = '숫자를 입력해주세요.';
        } else if (val < LIMITS[key].min || val > LIMITS[key].max) {
            errors[key] = `${LIMITS[key].min} ~ ${LIMITS[key].max}`;
        }
    });
    return errors;
}

export default function SetPage() {
    const [config, setConfig] = useState<Config>(DEFAULT_CONFIG);
    const [errors, setErrors] = useState<ErrorMap>({});
    const [saved, setSaved] = useState(false);
    const [syncedH, setSyncedH] = useState(false);

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

    const handleChange = (key: keyof Config, raw: string) => {
        const isInt = key === 'max_grid_width' || key === 'max_grid_height';
        const value = isInt ? parseInt(raw) : parseFloat(raw);
        let next = { ...config, [key]: value };
        if (key === 'px_per_cm_w' && syncedH) {
            next = { ...next, px_per_cm_h: value };
        }
        setConfig(next);
        setErrors(validate(next));
        setSaved(false);
    };

    const handleToggleSyncH = () => {
        if (!syncedH) {
            // 동기화 활성화: 세로를 가로와 동일하게
            const next = { ...config, px_per_cm_h: config.px_per_cm_w };
            setConfig(next);
            setErrors(validate(next));
        }
        setSyncedH(prev => !prev);
        setSaved(false);
    };

    const handleSave = async () => {
        const errs = validate(config);
        setErrors(errs);
        if (Object.keys(errs).length > 0) return;

        const { error } = await supabase
            .from('config')
            .upsert({ id: 1, ...config, updated_at: new Date().toISOString() }, { onConflict: 'id' });

        if (!error) {
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
        }
    };

    const hasError = Object.keys(errors).length > 0;

    const inputStyle = (disabled = false): React.CSSProperties => ({
        fontFamily: 'inherit',
        fontSize: 'var(--font-size-large)',
        background: disabled ? 'rgba(128,128,128,0.15)' : 'none',
        border: '1px solid var(--color-text)',
        color: disabled ? 'gray' : 'var(--color-text)',
        padding: '8px 12px',
        width: '100%',
        boxSizing: 'border-box',
        opacity: disabled ? 0.5 : 1,
    });

    const errorStyle: React.CSSProperties = {
        color: 'red',
        fontSize: 'var(--font-size-small)',
        textAlign: 'left',
    };

    const sectionStyle: React.CSSProperties = {
        marginBottom: '32px',
    };

    const pairRowStyle: React.CSSProperties = {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '12px',
    };

    const fieldStyle: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        textAlign: 'left',
    };

    const syncBtnStyle: React.CSSProperties = {
        fontFamily: 'inherit',
        fontSize: 'var(--font-size-small)',
        background: syncedH ? 'var(--color-text)' : 'none',
        border: '1px solid var(--color-text)',
        color: syncedH ? 'var(--color-bg)' : 'var(--color-text)',
        padding: '4px 8px',
        cursor: 'pointer',
        textAlign: 'left',
    };

    return (
        <div className="container">
            <main style={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
            }}>
                {/* 헤더 */}
                <div className="step-header" style={{ flexShrink: 0 }}>
                    <div className="text">설정</div>
                </div>

                {/* 스크롤 영역 */}
                <div style={{
                    flex: 1,
                    overflowY: 'auto',
                    padding: '16px 0',
                    WebkitOverflowScrolling: 'touch',
                }}>

                    {/* 축척 */}
                    <div style={sectionStyle}>
                        <div className="text" style={{ marginBottom: '12px', textAlign: 'left' }}>축척</div>

                        <div style={pairRowStyle}>
                            {/* 가로 비율 */}
                            <div style={fieldStyle}>
                                <span className="text" style={{ textAlign: 'left' }}>가로 비율</span>
                                <input
                                    type="number"
                                    step="0.01"
                                    style={inputStyle()}
                                    value={isNaN(config.px_per_cm_w) ? '' : config.px_per_cm_w}
                                    onChange={e => handleChange('px_per_cm_w', e.target.value)}
                                />
                                {errors.px_per_cm_w && <span style={errorStyle}>{errors.px_per_cm_w}</span>}
                            </div>

                            {/* 세로 비율 */}
                            <div style={fieldStyle}>
                                <span className="text" style={{ textAlign: 'left' }}>세로 비율</span>
                                <input
                                    type="number"
                                    step="0.01"
                                    disabled={syncedH}
                                    style={inputStyle(syncedH)}
                                    value={isNaN(config.px_per_cm_h) ? '' : config.px_per_cm_h}
                                    onChange={e => handleChange('px_per_cm_h', e.target.value)}
                                />
                                <button style={syncBtnStyle} onClick={handleToggleSyncH}>
                                    {syncedH ? '동기화 해제' : '가로와 동일하게'}
                                </button>
                                {errors.px_per_cm_h && <span style={errorStyle}>{errors.px_per_cm_h}</span>}
                            </div>
                        </div>
                    </div>

                    {/* 글자 비율 */}
                    <div style={sectionStyle}>
                        <div className="text" style={{ marginBottom: '12px', textAlign: 'left' }}>글자 비율</div>

                        <div style={fieldStyle}>
                            <span className="text" style={{ textAlign: 'left' }}>
                                {isNaN(config.font_size_ratio) ? '-' : config.font_size_ratio}
                            </span>
                            <input
                                type="range"
                                min={LIMITS.font_size_ratio.min}
                                max={LIMITS.font_size_ratio.max}
                                step="0.01"
                                style={{ width: '100%' }}
                                value={isNaN(config.font_size_ratio) ? 0.8 : config.font_size_ratio}
                                onChange={e => handleChange('font_size_ratio', e.target.value)}
                            />
                            <input
                                type="number"
                                step="0.01"
                                style={inputStyle()}
                                value={isNaN(config.font_size_ratio) ? '' : config.font_size_ratio}
                                onChange={e => handleChange('font_size_ratio', e.target.value)}
                            />
                            {errors.font_size_ratio && <span style={errorStyle}>{errors.font_size_ratio}</span>}
                        </div>
                    </div>

                    {/* 최대 개수 */}
                    <div style={sectionStyle}>
                        <div className="text" style={{ marginBottom: '12px', textAlign: 'left' }}>최대 개수</div>

                        <div style={pairRowStyle}>
                            {/* 가로 최대 개수 */}
                            <div style={fieldStyle}>
                                <span className="text" style={{ textAlign: 'left' }}>가로 최대 개수</span>
                                <input
                                    type="number"
                                    min={LIMITS.max_grid_width.min}
                                    max={LIMITS.max_grid_width.max}
                                    step="1"
                                    style={inputStyle()}
                                    value={isNaN(config.max_grid_width) ? '' : config.max_grid_width}
                                    onChange={e => handleChange('max_grid_width', e.target.value)}
                                />
                                {errors.max_grid_width && <span style={errorStyle}>{errors.max_grid_width}</span>}
                            </div>

                            {/* 세로 최대 개수 */}
                            <div style={fieldStyle}>
                                <span className="text" style={{ textAlign: 'left' }}>세로 최대 개수</span>
                                <input
                                    type="number"
                                    min={LIMITS.max_grid_height.min}
                                    max={LIMITS.max_grid_height.max}
                                    step="1"
                                    style={inputStyle()}
                                    value={isNaN(config.max_grid_height) ? '' : config.max_grid_height}
                                    onChange={e => handleChange('max_grid_height', e.target.value)}
                                />
                                {errors.max_grid_height && <span style={errorStyle}>{errors.max_grid_height}</span>}
                            </div>
                        </div>
                    </div>

                </div>

                {/* 저장 버튼 — 항상 하단 고정 */}
                <div style={{ flexShrink: 0, paddingTop: '12px' }}>
                    <button
                        onClick={handleSave}
                        className="text"
                        style={{
                            background: hasError ? 'gray' : 'var(--color-text)',
                            color: 'var(--color-bg)',
                            border: 'none',
                            padding: '12px 24px',
                            cursor: hasError ? 'not-allowed' : 'pointer',
                            fontFamily: 'inherit',
                            fontSize: 'var(--font-size-large)',
                            width: '100%',
                        }}
                    >
                        {saved ? '저장됨' : hasError ? '입력값을 확인해주세요' : '저장'}
                    </button>
                </div>
            </main>
        </div>
    );
}
