import React, { useState, useEffect, useRef, type FormEvent, type ChangeEvent } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import {
  DocumentIcon,
  UploadIcon,
  TrashIcon,
  ExternalLinkIcon,
  CheckCircleIcon,
  SpinnerIcon,
  ArrowRightIcon,
  ShieldLockIcon,
} from '../components/ui/Icons';

const VENDOR_SERVICE_URL =
  import.meta.env.VITE_VENDOR_SERVICE_URL ||
  import.meta.env.VENDOR_SERVICE_URL ||
  'http://localhost:3001';

export interface ProfileProps {
  onNavigateToLogin?: () => void;
  onNavigateToSignup?: () => void;
}

interface VendorData {
  userId?: number;
  email?: string;
  storeName?: string;
  slug?: string;
  status?: string;
  commissionPct?: number;
  payoutAccountId?: string;
  kycDocs?: string[];
  uuid?: string;
}

export const ProfilePage: React.FC<ProfileProps> = ({
  onNavigateToLogin,
  onNavigateToSignup,
}) => {
  const { loginUser, logoutUser } = useMarketplace();
  // Form State
  const [storeName, setStoreName] = useState('');
  const [slug, setSlug] = useState('');
  const [email, setEmail] = useState('');
  const [payoutAccountId, setPayoutAccountId] = useState('');
  const [status, setStatus] = useState('pending');
  const [commissionPct, setCommissionPct] = useState(0);
  const [kycDocs, setKycDocs] = useState<string[]>([]);
  const [userId, setUserId] = useState<number | null>(null);

  // File Upload State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploadingKyc, setIsUploadingKyc] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // UI state
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const getAuthToken = () => localStorage.getItem('vendor_token');

  const fetchProfile = async () => {
    setIsLoading(true);
    setErrorMsg(null);

    const token = getAuthToken();

    try {
      const res = await fetch(`${VENDOR_SERVICE_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token || ''}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        const vendor: VendorData = data.vendor || {};
        const user = data.user || {};

        setUserId(vendor.userId || user.userId || null);
        const resolvedEmail = vendor.email || user.email || '';
        setEmail(resolvedEmail);
        if (resolvedEmail) {
          loginUser(resolvedEmail);
        }
        setStoreName(vendor.storeName || '');
        setSlug(vendor.slug || '');
        setPayoutAccountId(vendor.payoutAccountId || '');
        setStatus(vendor.status || 'pending');
        setCommissionPct(vendor.commissionPct ?? 0);
        setKycDocs(vendor.kycDocs || []);
      } else {
        setErrorMsg('Please log in or request client membership to load and manage your vendor dossier.');
      }
    } catch {
      setErrorMsg('Could not reach Vendor Service. Ensure the service is online on port 3001.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProfile = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    const token = getAuthToken();
    if (!token) {
      setErrorMsg('Client session key not found. Please log in first.');
      setIsSaving(false);
      return;
    }

    try {
      const payload = {
        storeName: storeName.trim(),
        slug: slug.trim(),
        payoutAccountId: payoutAccountId.trim(),
        kycDocs,
      };

      const res = await fetch(`${VENDOR_SERVICE_URL}/vendor-data/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || data.error || 'Failed to update dossier');
      }

      setSuccessMsg('Storefront dossier successfully updated.');
      if (data.data) {
        setStoreName(data.data.storeName || storeName);
        setSlug(data.data.slug || slug);
        setPayoutAccountId(data.data.payoutAccountId || payoutAccountId);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error updating profile';
      setErrorMsg(msg);
    } finally {
      setIsSaving(false);
    }
  };

  const handleUploadKyc = async () => {
    if (!selectedFile) {
      setErrorMsg('Please select a KYC verification file (PDF, PNG, JPG).');
      return;
    }

    setIsUploadingKyc(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const token = getAuthToken();
    if (!token) {
      setErrorMsg('Client session key not found. Please log in first.');
      setIsUploadingKyc(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('document', selectedFile);

      const res = await fetch(`${VENDOR_SERVICE_URL}/vendor-data/upload-kyc`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || data.error || 'Failed to upload document');
      }

      setSuccessMsg('KYC verification document uploaded and archived.');
      if (data.data?.kycDocs) {
        setKycDocs(data.data.kycDocs);
      } else if (data.files) {
        setKycDocs((prev) => Array.from(new Set([...prev, ...data.files])));
      }

      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to archive document';
      setErrorMsg(msg);
    } finally {
      setIsUploadingKyc(false);
    }
  };

  const handleRemoveKycDoc = async (docToRemove: string) => {
    const updatedDocs = kycDocs.filter((d) => d !== docToRemove);
    setKycDocs(updatedDocs);

    const token = getAuthToken();
    if (token) {
      try {
        await fetch(`${VENDOR_SERVICE_URL}/vendor-data/profile`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ kycDocs: updatedDocs }),
        });
        setSuccessMsg('Archived document removed.');
      } catch {
        // silent rollback
      }
    }
  };

  const handleSignOut = () => {
    logoutUser();
    if (onNavigateToLogin) onNavigateToLogin();
  };

  const statusBadge = () => {
    switch (status.toLowerCase()) {
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-bold tracking-[0.18em] uppercase bg-emerald-50 text-emerald-800 border border-emerald-200">
            <span className="w-1.5 h-1.5 bg-emerald-600" />
            APPROVED & VERIFIED
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-bold tracking-[0.18em] uppercase bg-red-50 text-red-800 border border-red-200">
            <span className="w-1.5 h-1.5 bg-red-600" />
            REJECTED
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-bold tracking-[0.18em] uppercase bg-[#fbf7ed] text-[#8c6d48] border border-[#e8dfcf]">
            <span className="w-1.5 h-1.5 bg-[#8c6d48] animate-pulse" />
            UNDER ATELIER REVIEW
          </span>
        );
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto my-8 sm:my-14 px-4 sm:px-6">
      {/* Top Banner / Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-8 border-b border-neutral-200/90 gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[10px] font-bold tracking-[0.22em] uppercase text-[#9c784e]">
            <span className="w-2 h-2 bg-[#9c784e]" aria-hidden="true" />
            <span>DOSSIER ADMINISTRATION • EST. 2025</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-normal tracking-tight text-neutral-900">
            Store Vault & Provenance Management
          </h1>
          <p className="text-xs text-neutral-500 max-w-xl">
            Configure your boutique credentials, verify KYC provenance certificates, and manage bespoke payout accounts.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {onNavigateToSignup && (
            <button
              type="button"
              onClick={onNavigateToSignup}
              className="px-3 py-2 text-[10px] font-semibold tracking-[0.16em] uppercase border border-neutral-300 text-neutral-800 hover:border-black cursor-pointer transition-colors"
            >
              NEW DOSSIER
            </button>
          )}
          <button
            type="button"
            onClick={handleSignOut}
            className="px-3 py-2 text-[10px] font-semibold tracking-[0.16em] uppercase bg-neutral-100 hover:bg-neutral-200 text-neutral-800 cursor-pointer transition-colors"
          >
            SIGN OUT
          </button>
        </div>
      </div>

      {/* Alerts */}
      {successMsg && (
        <div className="mb-6 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs tracking-wide flex items-center gap-2">
          <CheckCircleIcon className="text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-700 text-xs tracking-wide">
          {errorMsg}
        </div>
      )}

      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3 text-neutral-400">
          <SpinnerIcon className="w-8 h-8 text-neutral-800" />
          <p className="text-xs tracking-widest uppercase">Opening Atelier Archive...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Store Profile Form */}
          <div className="lg:col-span-7 bg-white border border-neutral-200/90 p-6 sm:p-10 shadow-[0_4px_24px_rgba(0,0,0,0.03)] space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
              <div className="inline-flex items-center gap-2 text-[10px] font-semibold tracking-[0.2em] uppercase text-neutral-600">
                <span className="w-4 h-px bg-neutral-400" />
                <span>STOREFRONT DOSSIER</span>
              </div>
              <div>{statusBadge()}</div>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-5" noValidate>
              {/* Store Name */}
              <div>
                <label
                  htmlFor="profile-store-name"
                  className="block text-[10px] font-semibold tracking-[0.18em] uppercase text-neutral-700 mb-1.5"
                >
                  STORE NAME / DOSSIER TITLE <span className="text-neutral-900">*</span>
                </label>
                <input
                  id="profile-store-name"
                  type="text"
                  value={storeName}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    setStoreName(e.target.value);
                    if (!slug) {
                      setSlug(e.target.value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-'));
                    }
                  }}
                  required
                  placeholder="e.g. Apex Artisans Atelier"
                  className="w-full bg-[#f4f4f2] border border-neutral-200 hover:border-neutral-300 text-neutral-900 text-xs sm:text-sm px-3.5 py-3 rounded-none transition-colors duration-150 focus:outline-none"
                />
              </div>

              {/* URL Slug */}
              <div>
                <label
                  htmlFor="profile-slug"
                  className="block text-[10px] font-semibold tracking-[0.18em] uppercase text-neutral-700 mb-1.5"
                >
                  ARCHIVE CATALOG SLUG <span className="text-neutral-900">*</span>
                </label>
                <input
                  id="profile-slug"
                  type="text"
                  value={slug}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setSlug(e.target.value)}
                  required
                  placeholder="apex-artisans"
                  className="w-full bg-[#f4f4f2] border border-neutral-200 hover:border-neutral-300 text-neutral-900 text-xs sm:text-sm px-3.5 py-3 rounded-none transition-colors duration-150 focus:outline-none font-mono text-[11px]"
                />
                <p className="mt-1 text-[10px] text-neutral-500">
                  Public showroom URL: <code className="text-neutral-700 font-semibold">/store/{slug || 'your-store'}</code>
                </p>
              </div>

              {/* Email & ID Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="profile-email"
                    className="block text-[10px] font-semibold tracking-[0.18em] uppercase text-neutral-500 mb-1.5"
                  >
                    IDENTIFICATION / EMAIL
                  </label>
                  <input
                    id="profile-email"
                    type="email"
                    value={email}
                    disabled
                    className="w-full bg-[#ecebe7] border border-neutral-300 text-neutral-700 text-xs px-3.5 py-3 rounded-none cursor-not-allowed"
                  />
                </div>

                <div>
                  <label
                    htmlFor="profile-user-id"
                    className="block text-[10px] font-semibold tracking-[0.18em] uppercase text-neutral-500 mb-1.5"
                  >
                    DOSSIER CLIENT ID
                  </label>
                  <input
                    id="profile-user-id"
                    type="text"
                    value={userId ? `VAULT-NO-${userId}` : 'PENDING'}
                    disabled
                    className="w-full bg-[#ecebe7] border border-neutral-300 text-neutral-700 text-xs px-3.5 py-3 rounded-none cursor-not-allowed font-mono"
                  />
                </div>
              </div>

              {/* Payout Account ID */}
              <div>
                <label
                  htmlFor="profile-payout"
                  className="block text-[10px] font-semibold tracking-[0.18em] uppercase text-neutral-700 mb-1.5"
                >
                  REMITTANCE / PAYOUT ACCOUNT ID
                </label>
                <input
                  id="profile-payout"
                  type="text"
                  value={payoutAccountId}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setPayoutAccountId(e.target.value)}
                  placeholder="e.g. IBAN-FR76-XXXX or Stripe Connect Account"
                  className="w-full bg-[#f4f4f2] border border-neutral-200 hover:border-neutral-300 text-neutral-900 text-xs sm:text-sm px-3.5 py-3 rounded-none transition-colors duration-150 focus:outline-none"
                />
                <p className="mt-1 text-[10px] text-neutral-500">
                  Acquisitions and commission disbursements are remitted to this account ID.
                </p>
              </div>

              {/* Commission Tag */}
              {commissionPct > 0 && (
                <div className="p-3 bg-[#f7f6f2] border border-neutral-200 text-neutral-700 text-xs flex items-center justify-between">
                  <span className="text-[10px] font-semibold tracking-[0.16em] uppercase">
                    CONTRACTED ATELIER COMMISSION
                  </span>
                  <span className="font-bold text-neutral-900">{commissionPct}%</span>
                </div>
              )}

              {/* Save Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="w-full hover:bg-neutral-800 active:bg-neutral-900 text-white py-3.5 px-6 font-semibold tracking-[0.18em] uppercase text-xs transition-colors rounded-none flex items-center justify-center gap-2 shadow-sm cursor-pointer disabled:opacity-60"
                >
                  {isSaving ? (
                    <>
                      <SpinnerIcon />
                      <span>SAVING DOSSIER...</span>
                    </>
                  ) : (
                    <>
                      <span>UPDATE STORE DOSSIER</span>
                      <ArrowRightIcon />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Right Column: KYC Provenance & Care Inset */}
          <div className="lg:col-span-5 bg-white border border-neutral-200/90 p-6 sm:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.03)] space-y-6 flex flex-col justify-between">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
                <div className="space-y-0.5">
                  <span className="block text-[10px] font-bold tracking-[0.18em] uppercase text-[#9c784e]">
                    PROVENANCE & CARE
                  </span>
                  <h2 className="text-sm font-semibold tracking-wide text-neutral-900 uppercase">
                    KYC Verification Archives
                  </h2>
                </div>
                <div className="p-1.5 bg-[#f4f2ee] border border-neutral-300">
                  <ShieldLockIcon className="text-[#9c784e]" />
                </div>
              </div>

              <p className="text-xs text-neutral-600 leading-relaxed mt-4 mb-6">
                Upload official provenance records, certificates of authenticity, and commercial tax registrations (PDF, PNG, JPG up to 10MB).
              </p>

              {/* Upload Box */}
              <div className="border border-neutral-300 bg-[#fbfbfa] p-5 text-center space-y-3">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".pdf,.png,.jpg,.jpeg,.webp"
                  className="hidden"
                  id="kyc-file-upload"
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    if (e.target.files && e.target.files[0]) {
                      setSelectedFile(e.target.files[0]);
                    }
                  }}
                />

                <label
                  htmlFor="kyc-file-upload"
                  className="cursor-pointer flex flex-col items-center justify-center gap-2 select-none"
                >
                  <div className="w-10 h-10 border border-neutral-300 bg-white flex items-center justify-center text-neutral-700 shadow-sm">
                    <UploadIcon />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-neutral-900 underline underline-offset-2">
                      SELECT PROVENANCE DOSSIER
                    </span>
                    <p className="text-[10px] text-neutral-500 mt-1">
                      PDF, JPG, PNG up to 10MB
                    </p>
                  </div>
                </label>

                {selectedFile && (
                  <div className="p-2.5 bg-white border border-neutral-300 text-xs flex items-center justify-between">
                    <span className="truncate max-w-50 font-medium text-neutral-800">
                      {selectedFile.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedFile(null);
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }}
                      className="text-neutral-400 hover:text-black ml-2 cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                )}

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleUploadKyc}
                    disabled={isUploadingKyc || !selectedFile}
                    className="w-full bg-[#2a2825] hover:bg-black text-white py-3 px-4 text-[10px] font-semibold tracking-[0.18em] uppercase transition-colors cursor-pointer rounded-none disabled:opacity-40"
                  >
                    {isUploadingKyc ? 'ARCHIVING DOCUMENT...' : 'UPLOAD ARCHIVAL DOCUMENT'}
                  </button>
                </div>
              </div>

              {/* Uploaded Documents List */}
              <div className="mt-8 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold tracking-[0.18em] uppercase text-neutral-500">
                    REGISTERED DOCUMENTS ({kycDocs.length})
                  </span>
                </div>

                {kycDocs.length === 0 ? (
                  <div className="p-4 bg-[#f8f8f6] border border-neutral-200/80 text-center text-xs text-neutral-500">
                    No provenance certificates archived yet.
                  </div>
                ) : (
                  <ul className="space-y-2">
                    {kycDocs.map((docPath, index) => {
                      const fileName = docPath.split('/').pop() || docPath;
                      const docUrl = docPath.startsWith('http')
                        ? docPath
                        : `${VENDOR_SERVICE_URL}${docPath.startsWith('/') ? '' : '/'}${docPath}`;

                      return (
                        <li
                          key={index}
                          className="flex items-center justify-between p-3 border border-neutral-200 bg-[#fbfbfa] text-xs gap-2"
                        >
                          <div className="flex items-center gap-2.5 truncate">
                            <DocumentIcon className="w-4 h-4 text-[#9c784e] shrink-0" />
                            <a
                              href={docUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="truncate font-medium text-neutral-900 hover:underline flex items-center gap-1"
                            >
                              <span>{fileName}</span>
                              <ExternalLinkIcon className="text-neutral-400 shrink-0" />
                            </a>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleRemoveKycDoc(docPath)}
                            className="text-neutral-400 hover:text-red-700 transition-colors p-1 cursor-pointer shrink-0"
                            title="Remove document from archive"
                          >
                            <TrashIcon />
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </div>

            {/* Inset Footer info */}
            <div className="pt-6 border-t border-neutral-200 text-[10px] font-semibold tracking-[0.18em] uppercase text-neutral-400 flex items-center justify-between">
              <span>PARIS • TOKYO • NEW YORK</span>
              <span>VAULT ENCRYPTION 256</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
